import { Account, Client, Databases, Query } from "node-appwrite";
import Config from "../config/config.js";
import ErrorHandler from "../handlers/errorHandler.js";
import { Request, Response, NextFunction } from 'express';

const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID);

const { HOSPITAL_COLLECTION_ID, DATABASE_ID } = Config.APPWRITE;

const database = new Databases(client);
const account = new Account(client);

const getHospitalInfo = async (id: string) => {
  try {
    const hospital = await database.listDocuments(
      DATABASE_ID,
      HOSPITAL_COLLECTION_ID,
      [Query.equal("userId", [id])]
    );

    return hospital.documents[0];
  } catch (error) {
    throw error;
  }
};

const authMiddleware = async (req:any, res:Response, next:NextFunction) => {
  const session = JSON.parse(
    req.headers.authorization || req.headers.Authorization
  );

  if (!session || !session.$id || !session.secret) {
    return next(new ErrorHandler(401, "Unauthorized access"));
  }

  try {
    const isValidSession = await account.getSession(session.$id);

    if (!isValidSession) {
      return next(new ErrorHandler(401, "Invalid session"));
    }

    const hospital = await getHospitalInfo(isValidSession.userId);
    req.hospital = hospital;
    next();
  } catch (error:any) {
    return next(new ErrorHandler(401, "Unauthorized access", error));
  }
};

export default authMiddleware;
