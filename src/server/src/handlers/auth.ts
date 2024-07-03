import bcrypt from "bcryptjs";
import catchAsync from "../middlewares/catchAsync.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import Config from "../config/config.js";
import Patient from "../models/patient.js";
import Hospital from "../models/hospital.js";
import {
  hospitalSignUpSchema,
  loginSchema,
  patientSignUpSchema,
} from "../schemas/index.js";
import ErrorHandler from "./errorHandler.js";
import { createSession, deleteSession } from "../providers/session.js";
import { Request, Response, NextFunction } from "express";

passport.use(
  new GoogleStrategy(
    {
      clientID: Config.GOOGLE.CLIENT_ID,
      clientSecret: Config.GOOGLE.CLIENT_SECRET,
      callbackURL: `${Config.BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let patient = await Patient.findOne({ googleId: profile.id });
        if (!patient) {
          patient = await Patient.create({
            googleId: profile.id,
            email: profile?.emails[0].value,
            fullName: profile.displayName,
            avatar: profile?.photos[0].value,
          });
        }
        return done(null, patient);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((patient, done) => {
  done(null, patient?.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const patient = await Patient.findById(id);
    done(null, patient);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

export const HospitalSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      email,
      password,
      hospitalName,
      phone,
      hospitalNumber,
      coordinates,
    } = req.body;

    const { error } = hospitalSignUpSchema.validate(req.body);
    if (error) return next(new ErrorHandler(400, error.details[0].message));

    try {
      const existingHospital = await Hospital.findOne({ email });
      if (existingHospital) {
        return next(new ErrorHandler(400, "Email is already registered."));
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newHospital = new Hospital({
        email,
        phone,
        password: hashedPassword,
        hospitalName,
        hospitalNumber,
        coordinates,
      });

      await newHospital.save();
     
      return createSession(newHospital, 200, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const HospitalLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error) return next(new ErrorHandler(400, error.details[0].message));

    try {
      const hospital = await Hospital.findOne({ email });
      if (!hospital) {
        return next(new ErrorHandler(400, "Invalid email or password."));
      }

      const isMatch = await bcrypt.compare(password, hospital.password);
      if (!isMatch) {
        return next(new ErrorHandler(400, "Invalid email or password."));
      }
      return createSession(hospital, 200, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const PatientSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName, phone } = req.body;

    // const { error } = patientSignUpSchema.validate(req.body);

    // if (error) return next(new ErrorHandler(400, error.details[0].message));

    try {
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return next(new ErrorHandler(400, "Email is already registered."));
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newPatient = new Patient({
        email,
        phone,
        password: hashedPassword,
        fullName,
      });

      await newPatient.save();

    
      return createSession(newPatient, 200, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const PatientLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error) return next(new ErrorHandler(400, error.details[0].message));

    try {
      const patient = await Patient.findOne({ email });
      if (!patient) {
        return next(new ErrorHandler(400, "Invalid email or password."));
      }

      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) {
        return next(new ErrorHandler(400, "Invalid email or password."));
      }

      return createSession(patient, 200, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const BulkHospitalSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hospitals = req.body;

    if (!Array.isArray(hospitals)) {
      return next(
        new ErrorHandler(
          400,
          "Invalid input format. Expected an array of hospitals."
        )
      );
    }

    const results = [];
    for (const hospitalData of hospitals) {
      const {
        email,
        password,
        hospitalName,
        phone,
        hospitalNumber,
        coordinates,
      } = hospitalData;

      const { error } = hospitalSignUpSchema.validate(hospitalData);
      if (error) {
        results.push({
          email,
          success: false,
          message: error.details[0].message,
        });
        continue;
      }

      try {
        const existingHospital = await Hospital.findOne({ email });
        if (existingHospital) {
          results.push({
            email,
            success: false,
            message: "Email is already registered.",
          });
          continue;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newHospital = new Hospital({
          email,
          phone,
          password: hashedPassword,
          hospitalName,
          hospitalNumber,
          coordinates,
        });

        await newHospital.save();

        results.push({ email, success: true });
      } catch (error: any) {
        results.push({ email, success: false, message: error.message });
      }
    }

    res.status(201).json({
      success: true,
      results,
    });
  }
);
