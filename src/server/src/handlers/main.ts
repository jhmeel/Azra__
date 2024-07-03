import { NextFunction, Request, Response } from "express";
import catchAsync from "../middlewares/catchAsync.js";
import Review from "../models/review.js";
import Hospital from "../models/hospital.js";
import ErrorHandler from "./errorHandler.js";
import cloudinary from "cloudinary";
import Patient from "../models/patient.js";
import {
  extractMajorDisorders,
  generateResetToken,
  loadDisorders,
  sendPasswordResetEmail,
} from "../utils/functions.js";
import bcrypt from "bcryptjs";
import Ping from "../models/ping.js";
import axios from "axios";
import Config from "../config/config.js";

export const createReview = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params;
    const { rating, comment } = req.body;

    const review = new Review({
      patientId: req?.user._id,
      hospitalId,
      rating,
      comment,
    });

    try {
      const savedReview = await review.save();
      await Hospital.findByIdAndUpdate(hospitalId, {
        $push: { reviews: savedReview._id },
      });

      res.status(201).json({
        success: true,
        message: "Review submitted successfully!",
        review: savedReview,
      });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId, rating, comment } = req.body;

    try {
      const review = await Review.findByIdAndUpdate(
        reviewId,
        { rating, comment },
        { new: true }
      );

      if (!review) {
        return next(new ErrorHandler(404, "Review not found."));
      }

      res.status(200).json({
        success: true,
        message: "Review updated successfully!",
        review,
      });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const updateHospitalProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params;
    const {
      email,
      phone,
      hospitalName,
      hospitalNumber,
      coordinates,
      avatar,
      verificationDocuments,
    } = req.body;

    try {
      interface Doc {
        type: string;
        secureUrl: string;
        publicId: string;
      }
      interface IUpdate {
        email: string;
        phone: string;
        hospitalName: string;
        hospitalNumber: string;
        coordinates: string;
        status: string;
        avatar: {
          secureUrl: string;
          publicId: string;
        };
        verificationDocuments: Array<Doc>;
      }
      const updates: Partial<IUpdate> = {
        email,
        phone,
        hospitalName,
        hospitalNumber,
        coordinates,
      };

      const toUpdate: any = await Hospital.findById(hospitalId);

      if (avatar) {
        // Delete existing avatar from Cloudinary if it exists
        if (toUpdate.avatar && toUpdate.avatar.publicId) {
          await cloudinary.v2.uploader.destroy(toUpdate.avatar.publicId);
        }

        // Upload new avatar to Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(
          avatar.secureUrl,
          {
            public_id: avatar.publicId,
          }
        );
        updates.avatar = {
          secureUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        };
      }

      // Handle verification documents update
      if (verificationDocuments && verificationDocuments.length > 0) {
        // Delete existing verification documents from Cloudinary if they exist
        if (
          toUpdate.verificationDocuments &&
          toUpdate.verificationDocuments.length > 0
        ) {
          await Promise.all(
            toUpdate.verificationDocuments.map(async (doc: Doc) => {
              await cloudinary.v2.uploader.destroy(doc.publicId);
            })
          );
        }

        updates.verificationDocuments = await Promise.all(
          verificationDocuments.map(async (doc: Doc) => {
            const uploadResponse = await cloudinary.v2.uploader.upload(
              doc.secureUrl,
              {
                public_id: doc.publicId,
              }
            );
            return {
              type: doc.type,
              secureUrl: uploadResponse.secure_url,
              publicId: uploadResponse.public_id,
            };
          })
        );
      }

      const updatedHospital = await Hospital.findByIdAndUpdate(
        hospitalId,
        updates,
        { new: true }
      );

      if (!updatedHospital) {
        return next(new ErrorHandler(404, "Hospital not found."));
      }

      res.status(200).json({
        success: true,
        message: "Hospital profile updated successfully!",
        hospital: updatedHospital,
      });
    } catch (error: any) {
      next(new ErrorHandler(400, error.message));
    }
  }
);




export const updatePatientProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { patientId } = req.params;
    const { email, phone, fullName, avatar } = req.body;

    try {
      interface IPUpdate {
        email: string;
        phone: string;
        fullName: string;
        avatar: {
          secureUrl: string;
          publicId: string;
        };
      }
      const updates: Partial<IPUpdate> = { email, phone, fullName };

      const toUpdate: any = await Patient.findById(patientId);

      if (avatar) {
        // Delete existing avatar from Cloudinary if it exists
        if (toUpdate.avatar && toUpdate.avatar.publicId) {
          await cloudinary.v2.uploader.destroy(toUpdate.avatar.publicId);
        }

        // Upload new avatar to Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(
          avatar.secureUrl,
          {
            public_id: avatar.publicId,
          }
        );
        updates.avatar = {
          secureUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        };
      }

      // Update the patient profile in the database
      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        updates,
        { new: true }
      );

      if (!updatedPatient) {
        return next(new ErrorHandler(404, "Patient not found."));
      }

      res.status(200).json({
        success: true,
        message: "Patient profile updated successfully!",
        patient: updatedPatient,
      });
    } catch (error: any) {
      next(new ErrorHandler(400, error.message));
    }
  }
);

export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params;

    try {
      const deletedReview = await Review.findByIdAndDelete(reviewId);

      res.status(200).json({
        success: true,
        message: "Review deleted successfully!",
        review: deletedReview,
      });
    } catch (error: any) {
      next(new ErrorHandler(400, error.message));
    }
  }
);

// Request password reset (forgot password) for patients
export const forgotPasswordPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Find patient by email
    const patient: any = await Patient.findOne({ email });

    if (!patient) {
      return next(new ErrorHandler(404, "Patient not found."));
    }

    // Generate and save reset token and expiry
    const { resetToken, resetTokenExpiry } = generateResetToken();
    patient.resetPasswordToken = resetToken;
    patient.resetPasswordExpire = resetTokenExpiry;
    await patient.save({ validateBeforeSave: false });

    // Send reset password email
    await sendPasswordResetEmail("Patient", email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully!",
    });
  }
);

// Request password reset (forgot password) for hospitals
export const forgotPasswordHospital = catchAsync(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Find hospital by email
    const hospital: any = await Hospital.findOne({ email });

    if (!hospital) {
      return next(new ErrorHandler(404, "Hospital not found."));
    }

    // Generate and save reset token and expiry
    const { resetToken, resetTokenExpiry } = generateResetToken();
    hospital.resetPasswordToken = resetToken;
    hospital.resetPasswordExpire = resetTokenExpiry;
    await hospital.save({ validateBeforeSave: false });

    // Send reset password email
    await sendPasswordResetEmail("Hospital", email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully!",
    });
  })
);

// Reset password (update password after receiving reset token)
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userType, resetToken } = req.params;
    const { newPassword } = req.body;

    const Model = userType === "patient" ? Patient : Hospital;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find user by reset token and ensure token is not expired
    const user = await Model.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler(400, "Invalid or expired reset token."));
    }

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  }
);

export const updatePasswordPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { patientId } = req.params;
    const { currentPassword, newPassword } = req.body;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return next(new ErrorHandler(404, "Patient not found."));
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      patient.password
    );

    if (!isPasswordMatch) {
      return next(new ErrorHandler(400, "Current password is incorrect."));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    patient.password = hashedPassword;
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  }
);

export const updatePasswordHospital = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params;
    const { currentPassword, newPassword } = req.body;

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return next(new ErrorHandler(404, "Hospital not found."));
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      hospital.password
    );

    if (!isPasswordMatch) {
      return next(new ErrorHandler(400, "Current password is incorrect."));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    hospital.password = hashedPassword;
    await hospital.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  }
);

export const findNearbyHospitals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lat, lng, range, status } = req.body;
    
      let pipeline = [];
      
      if (range > 0) {
        pipeline.push({
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            distanceField: "distance",
            maxDistance: range * 1000,
            spherical: true
          }
        });
      }
      
      if (status) {
        pipeline.push({
          $match: {
            status: { $regex: new RegExp(status, "i") }
          }
        });
      }

      pipeline.push({
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'hospital',
          as: 'reviews'
        }
      });

      const hospitals = await Hospital.aggregate(pipeline);
      
      res.status(200).json({ success: true, hospitals });
    }
);
export const getHospitalPings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params;

    try {
      const hospital = await Hospital.findById(hospitalId).populate("pings");

      if (!hospital) {
        return next(new ErrorHandler(404, "Hospital not found."));
      }

      res.status(200).json({ success: true, pings: hospital.pings });
    } catch (err) {
      next(new ErrorHandler(500, "Error fetching hospital pings", err));
    }
  }
);

// Get major disorders in hospital pings for plotting a bar chart
export const getMajorDisorders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params;

    try {
      // Call loadDisorders to train the classifier
      loadDisorders();

      const hospital = await Hospital.findById(hospitalId).populate("pings");

      if (!hospital) {
        return next(new ErrorHandler(404, "Hospital not found."));
      }

      const patientComplaints = hospital.pings.map((ping) => ping.complaint);

      const majorDisorders = extractMajorDisorders(patientComplaints);

      res.status(200).json({ success: true, majorDisorders });
    } catch (err: any) {
      next(new ErrorHandler(500, "Error fetching major disorders", err));
    }
  }
);

export const getHospitalById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hospitalId = req.params;
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return next(
        new ErrorHandler(404, `hospital not found with id: ${hospitalId} `)
      );
    }

    res.status(200).json({ success: true, hospital });
  }
);

export const getAllHospitals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hospitals = await Hospital.find();

    res.status(200).json({ success: true, hospitals });
  }
);

export const getPatientProfile = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const patient = await Patient.findById(req?.user._id);

    res.status(200).json({ success: true, patient });
  }
);

export const getHospitals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hospitals = await Hospital.find();

    res.status(200).json({ success: true, hospitals});
  }
);

