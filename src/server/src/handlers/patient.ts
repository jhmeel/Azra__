import Config from "../config/config.js";
import ErrorHandler from "./errorHandler.js";
import catchAsync from "../middlewares/catchAsync.js";
import { Client, Databases, ID, Storage } from "node-appwrite";
import { base64ToFile } from "../utils/functions.js";

import { Request, Response, NextFunction } from 'express';
import { updatePatientSchema } from "../schemas/index.js";

const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID)
  .setKey(Config.APPWRITE.APPWRITE_SECRET);

const { DATABASE_ID, BUCKET_ID, PINGS_COLLECTION_ID,PATIENT_COLLECTION_ID } =
  Config.APPWRITE;

const databases = new Databases(client);
const storage = new Storage(client);

export const getProfile = catchAsync(async (req:any, res:Response, next:NextFunction) => {
    const id = req.patient.$id;
  
    const patient = await databases.getDocument(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      id
    );
  
    res.status(200).json({ success: true, patient });
  });




  export const updatePatientById = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const { id } = req.params;
    const {
      email,
      fullName,
      avatar,
    } = req.body;
  
    const { error } = updatePatientSchema.validate(req.body);
    if (error) return next(new ErrorHandler(400, error.details[0].message));
    let avatarUrl;
  
    // Upload avatar if a file is provided
    if (avatar) {
      const file = base64ToFile(avatar, `${fullName}.jpg`);
      const fileUpload = await storage.createFile(BUCKET_ID, ID.unique(), file);
      avatarUrl = `https://cloud.appwrite.io/${BUCKET_ID}/${fileUpload.$id}`;
    }
  
    interface UpdateData {
      email?: string;
      fullName?: string;
      avatar?: string;
    }
    
    const updateData: Partial<UpdateData> = {};
    if (email) updateData.email = email;
    if (fullName) updateData.fullName = fullName;
    if (avatarUrl) updateData.avatar = avatarUrl;
    
  
    const updatedPatient = await databases.updateDocument(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      id,
      updateData
    );
  
    res.status(200).json({ success: true, updatedPatient });
  });