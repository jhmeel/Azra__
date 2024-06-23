import { Account, Client, Databases, Query } from "node-appwrite";
import Config from "../config/config.js";
import ErrorHandler from "../handlers/errorHandler.js";
import { Request, Response, NextFunction } from "express";

const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID);

const { HOSPITAL_COLLECTION_ID, DATABASE_ID, PATIENT_COLLECTION_ID } =
  Config.APPWRITE;

const database = new Databases(client);
const account = new Account(client);

const getInfo = async (id: string, isHospital: boolean) => {
  try {
    const entityCollectionId = isHospital
      ? HOSPITAL_COLLECTION_ID
      : PATIENT_COLLECTION_ID;
    const entity = await database.listDocuments(
      DATABASE_ID,
      entityCollectionId,
      [Query.equal("userId", [id])]
    );

    return entity.documents[0];
  } catch (error) {
    throw error;
  }
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const role = req.headers.role;

  if (!authHeader || typeof authHeader !== "string") {
    return next(new ErrorHandler(401, "Unauthorized access"));
  }
  if (!role || typeof role !== "string") {
    return next(new ErrorHandler(401, "Missing entity role"));
  }
  const sessionSecret = authHeader.replace("Bearer:", "");

  if (!sessionSecret) {
    return next(new ErrorHandler(401, "Unauthorized access"));
  }

  try {
    // Verify the session
    client.setSession(sessionSecret);
    const session = await account.get();

    if (!session) {
      return next(new ErrorHandler(401, "Invalid session"));
    }

    const entity = await getInfo(session.$id, role === "HOSPITAL");

    if (!entity) {
      return next(new ErrorHandler(404, `${role} not found`));
    }
    (req as any)[role.toLowerCase()] = role;

    next();
  } catch (error: any) {
    return next(new ErrorHandler(401, "Unauthorized access", error));
  }
};

export default authMiddleware;
