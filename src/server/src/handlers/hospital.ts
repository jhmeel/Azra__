import Config from "../config/config.js";
import ErrorHandler from "./errorHandler.js";
import catchAsync from "../middlewares/catchAsync.js";
import { Client, Databases, Query, ID, Storage } from "node-appwrite";
import { base64ToFile, getDistanceFromLatLonInKm } from "../utils/functions.js";
import {
  getHospitalsNearCoordinatesSchema,
  patientPingSchema,
  updateHospitalSchema,
} from "../schemas/index.js";
import { Request, Response, NextFunction } from 'express';

const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID)
  .setKey(Config.APPWRITE.APPWRITE_SECRET);

const { HOSPITAL_COLLECTION_ID, DATABASE_ID, BUCKET_ID, PINGS_COLLECTION_ID } =
  Config.APPWRITE;

const databases = new Databases(client);
const storage = new Storage(client);

export const getHospitalByName = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { name } = req.query;

  const response = await databases.listDocuments(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    [`equal("hospitalName", "${name}")`]
  );

  if (response.total === 0) {
    return res.status(404).json({ hospital: null });
  }

  res.status(200).json({ success: true, hospital: response.documents[0] });
});

export const getProfile = catchAsync(async (req:any, res:Response, next:NextFunction) => {
  const id = req.hospital.$id;

  const hospital = await databases.getDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    id
  );

  res.status(200).json({ success: true, hospital });
});

export const getHosptalById = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;

  const hospital = await databases.getDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    id
  );

  res.status(200).json({ success: true, hospital });
});

export const getAllHospials = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID
  );

  res.status(200).json({ success: true, hospitals: response.documents });
});

export const updateHospitalById = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;
  const {
    email,
    hospitalName,
    hospitalNumber,
    coordinates,
    avatar,
    availabilityStatus,
  } = req.body;

  const { error } = updateHospitalSchema.validate(req.body);
  if (error) return next(new ErrorHandler(400, error.details[0].message));
  let avatarUrl;

  // Upload avatar if a file is provided
  if (avatar) {
    const file = base64ToFile(avatar, `${hospitalName}.jpg`);
    const fileUpload = await storage.createFile(BUCKET_ID, ID.unique(), file);
    avatarUrl = `https://cloud.appwrite.io/${BUCKET_ID}/${fileUpload.$id}`;
  }

  interface UpdateData {
    email?: string;
    hospitalName?: string;
    hospitalNumber?: string;
    coordinates?: string;
    avatar?: string;
    availabilityStatus?: string;
  }
  
  const updateData: Partial<UpdateData> = {};
  if (email) updateData.email = email;
  if (hospitalName) updateData.hospitalName = hospitalName;
  if (hospitalNumber) updateData.hospitalNumber = hospitalNumber;
  if (coordinates) updateData.coordinates = coordinates;
  if (avatarUrl) updateData.avatar = avatarUrl;
  if (availabilityStatus) updateData.availabilityStatus = availabilityStatus;
  

  const updatedHospital = await databases.updateDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    id,
    updateData
  );

  res.status(200).json({ success: true, updatedHospital });
});

export const deleteHospitalById = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;

  const hospital = await databases.getDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    id
  );

  // Delete the avatar file from storage if it exists
  if (hospital.avatar) {
    const avatarFileId = hospital.avatar.split("/").pop();
    await storage.deleteFile(BUCKET_ID, avatarFileId);
  }

  await databases.deleteDocument(DATABASE_ID, HOSPITAL_COLLECTION_ID, id);

  res.status(200).json({ success: true, message: "Deleted successfully" });
});

export const findNearbyHospitals = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { lat, lng, range } = req.body;

  const { error } = getHospitalsNearCoordinatesSchema.validate(req.body);
  if (error) return next(new ErrorHandler(400, error.details[0].message));

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      HOSPITAL_COLLECTION_ID
    );

    // Filter hospitals based on distance
    const hospitals = response.documents.filter((hospital) => {
      const [hospitalLat, hospitalLng] = hospital.coordinates
        .split(",")
        .map(Number);
      const distance = getDistanceFromLatLonInKm(
        hospitalLat,
        hospitalLng,
        parseFloat(lat),
        parseFloat(lng)
      );
      return distance <= range;
    });

    res.status(200).json({ success: true, hospitals });
  } catch (err) {
    next(new ErrorHandler(500, "Error fetching hospitals"));
  }
});

export const pingHospital = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { fullname, complaint, hospitalId, image } = req.body;

  const { error } = patientPingSchema.validate(req.body);
  if (error) return next(new ErrorHandler(400, error.details[0].message));

  let imageUrl;

  // Upload image if provided

  if (image) {
    const file = base64ToFile(image, `${fullname}.jpg`);
    const fileUpload = await storage.createFile(BUCKET_ID, ID.unique(), file);
    imageUrl = `https://cloud.appwrite.io/${BUCKET_ID}/${fileUpload.$id}`;
  }

  const hospital = await databases.getDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    hospitalId
  );

  const ping = await databases.createDocument(
    DATABASE_ID,
    PINGS_COLLECTION_ID,
    ID.unique(),
    {
      fullname,
      complaint,
      imageUrl,
      hospitalId,
    }
  );

  // Update the "pings" array by pushing the new ping
  const updatedPings = hospital.pings
    ? [...hospital.pings, JSON.stringify(ping)]
    : [JSON.stringify(ping)];

  // Update the hospital document with the new "pings" array
  const updatedHospital = await databases.updateDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    hospitalId,
    {
      pings: updatedPings,
    }
  );

  //Mail hospital
  res.status(200).json({ success: true, ping, updatedHospital });
});

export const getHospitalPings = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;

  // Get the hospital document
  const hospital = await databases.getDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    id
  );

  // Fetch the actual ping documents
  const pings = await Promise.all(
    hospital.pings.map((ping:any) =>
      databases.getDocument(
        DATABASE_ID,
        PINGS_COLLECTION_ID,
        JSON.parse(ping).$id
      )
    )
  );

  res.status(200).json({ success: true, pings });
});

export const deletePing = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { hospitalId, pingId } = req.params;

  // Get the current hospital document
  const hospital = await databases.getDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    hospitalId
  );

  const updatedPings = hospital.pings.filter(
    (ping:any) => JSON.parse(ping).$id !== pingId
  );

  // Update the hospital document with the new "pings" array
  const updatedHospital = await databases.updateDocument(
    DATABASE_ID,
    HOSPITAL_COLLECTION_ID,
    hospitalId,
    {
      pings: updatedPings,
    }
  );

  const ping = await databases.getDocument(
    DATABASE_ID,
    PINGS_COLLECTION_ID,
    pingId
  );

  // Delete the ping image file from storage if it exists
  if (ping.imageUrl) {
    const imageFileId = ping.imageUrl.split("/").pop();
    await storage.deleteFile(BUCKET_ID, imageFileId);
  }
  // Delete the actual ping document
  await databases.deleteDocument(DATABASE_ID, PINGS_COLLECTION_ID, pingId);

  res.status(200).json({ success: true, updatedHospital });
});
