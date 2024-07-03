import { NextFunction, Response } from "express";
import catchAsync from "../middlewares/catchAsync.js";
import HospitalConversation from "../models/hospitalConversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../../main.js";
import PatientConversation from "../models/patientConversation.js";
import ErrorHandler from "./errorHandler.js";
import Patient from "../models/patient.js";
import Ping from "../models/ping.js";
import cloudinary from "cloudinary";
import Hospital from "../models/hospital.js";

export const hSendMessage = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req?.user._id;

    let conversation = await HospitalConversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await HospitalConversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json({ success: true, message: newMessage });
  }
);

export const getHMessages = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { id: userToChatId } = req.params;
    const senderId = req?.user._id;

    const conversation = await HospitalConversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json({ success: true, messages });
  }
);

export const getHPMessages = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { id: hospitalToChatId } = req.params;
    const senderId = req?.user._id;

    const conversation = await PatientConversation.findOne({
      participants: { $all: [senderId, hospitalToChatId] },
    }).populate("messages").populate("ping")

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json({ success: true, messages });
  }
);

export const pingHospital = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { patientId, hospitalId, complaint, severity, image } = req.body;

    try {
      let imageUrl = null;
      let publicId = null;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return next(new ErrorHandler(404, "Patient not found"));
      }

      if (image) {
        const uploadResponse = await cloudinary.v2.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
        publicId = uploadResponse.public_id;
      }

      const newPing = new Ping({
        patient: patientId,
        hospital: hospitalId,
        complaint,
        severity,
        image: { secureUrl: imageUrl, publicId },
      });

      await newPing.save();

      // Check for an existing conversation
      let existingConversation = await PatientConversation.findOne({
        participants: { $all: [patientId, hospitalId] },
      });

      if (existingConversation) {
        // Update the existing conversation with the new ping
        existingConversation.ping.push(newPing._id);
        await existingConversation.save();
      } else {
        // Create a new conversation
        existingConversation = new PatientConversation({
          ping: [newPing._id],
          participants: [patientId, hospitalId],
        });
        await existingConversation.save();
      }

      // Update hospital's pings array
      const hospital = await Hospital.findByIdAndUpdate(
        hospitalId,
        { $push: { pings: newPing._id } },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: "Ping sent successfully!",
        ping: newPing,
        hospital,
        conversation: existingConversation,
      });
    } catch (error: any) {
      next(new ErrorHandler(400, error.message));
    }
  }
);

export const hpSendMessage = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req?.user._id;
    try {
      // Check for an existing conversation
    
      let conversation = await PatientConversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        // Create a new conversation if not exists
        conversation = new PatientConversation({
          participants: [senderId, receiverId],
        });
        await conversation.save();
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        message:message,
      });

      await newMessage.save();

      conversation.messages.push(newMessage._id);
      await conversation.save();

      res.status(201).json({
        success: true,
        message: "Message sent successfully!",
        conversation,
      });
    } catch (error: any) {
      next(new ErrorHandler(400, error.message));
    }
  }
);

export const hpUpdateMessage = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { messageId, newMessageContent } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { message: newMessageContent },
      { new: true, runValidators: true }
    );

    if (!message) {
      return next(new ErrorHandler(404, "Message not found"));
    }

    res.status(200).json({
      success: true,
      message: "Message updated successfully!",
    });
  }
);

export const hpDeleteMessage = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { conversationId, messageId } = req.body;

    const conversation = await PatientConversation.findById(conversationId);
    if (!conversation) {
      return next(new ErrorHandler(404, "Conversation not found"));
    }

    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      return next(new ErrorHandler(404, "Message not found"));
    }

    conversation.messages?.pull(messageId);
    await conversation.save();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully!",
    });
  }
);

export const hDeleteMessage = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { conversationId, messageId } = req.body;

    const conversation = await HospitalConversation.findById(conversationId);
    if (!conversation) {
      return next(new ErrorHandler(404, "Conversation not found"));
    }

    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      return next(new ErrorHandler(404, "Message not found"));
    }

    conversation.messages?.pull(messageId);
    await conversation.save();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully!",
    });
  }
);

// Update a ping
export const updatePing = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { pingId } = req.params;
    const { assignedPhysician, status } = req.body;

    try {
      const existingPing = await Ping.findById(pingId);

      if (!existingPing) {
        return next(new ErrorHandler(404, "Ping not found."));
      }

      let updatedPingData = {
        status,
        assignedPhysician,
      };

      const updatedPing = await Ping.findByIdAndUpdate(
        pingId,
        updatedPingData,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Ping updated successfully!",
        ping: updatedPing,
      });
    } catch (error: any) {
      next(new ErrorHandler(400, error.message));
    }
  }
);

export const deletePing = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { pingId } = req.params;

    try {
      const pingToDelete = await Ping.findById(pingId);

      if (!pingToDelete) {
        return next(new ErrorHandler(404, "Ping not found."));
      }

      if (pingToDelete.image && pingToDelete.image.publicId) {
        await cloudinary.v2.uploader.destroy(pingToDelete.image.publicId);
      }

      const deletedPing = await Ping.findByIdAndDelete(pingId);

      res.status(200).json({
        success: true,
        message: "Ping deleted successfully!",
        ping: deletedPing,
      });
    } catch (error: any) {
      next(new ErrorHandler(400, error.message));
    }
  }
);
