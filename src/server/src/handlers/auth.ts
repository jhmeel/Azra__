import catchAsync from "../middlewares/catchAsync.js";
import {
  Client,
  Users,
  Databases,
  ID,
  Account,
  Query,
  OAuthProvider,
} from "node-appwrite";
import Config from "../config/config.js";
import ErrorHandler from "./errorHandler.js";
import {
  loginSchema,
  hospitalSignUpSchema,
  patientSignUpSchema,
} from "../schemas/index.js";
import { Request, Response, NextFunction } from "express";
import { Role } from "./types/index.js";
const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID)
  .setKey(Config.APPWRITE.APPWRITE_SECRET);

const users = new Users(client);
const database = new Databases(client);
const account = new Account(client);

const { DATABASE_ID, HOSPITAL_COLLECTION_ID, PATIENT_COLLECTION_ID } =
  Config.APPWRITE;

export const onPatientOauthSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    "http://localhost:8000/api/v1/auth/p-oauth/success",
    "http://localhost:8000/failure"
  );

  res.redirect(redirectUrl);
};

export const OnPatientOauthSignUpSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, secret } = req.query;

  try {
    const session = await account.createSession(userId, secret);

    res.status(201).json({
      success: true,
      message: "Sign up successful! Please check your email for confirmation.",
      session,
    });
  } catch (error: any) {
    return next(new ErrorHandler(400, error.message));
  }
};

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
      const hospitalList = await users.list([Query.equal("email", email)]);

      if (hospitalList.total > 0) {
        return next(new ErrorHandler(400, "Email is already registered."));
      }

      const hospital = await users.create(
        ID.unique(),
        email,
        phone,
        password,
        hospitalName
      );
      try {
        await database.createDocument(
          DATABASE_ID,
          HOSPITAL_COLLECTION_ID,
          ID.unique(),
          {
            userId: hospital.$id,
            email,
            phone,
            hospitalName: hospitalName.toString(),
            hospitalNumber,
            coordinates,
          }
        );
      } catch (documentError) {
        await users.delete(hospital.$id);
        throw documentError;
      }

      const session = await account.createEmailPasswordSession(email, password);

      res.status(201).json({
        success: true,
        message:
          "Sign up successful! Please check your email for confirmation.",
        role: Role.HOSPITAL,
        session,
        hospital,
      });
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
      const session = await account.createEmailPasswordSession(email, password);
      const hospital = await database.listDocuments(
        DATABASE_ID,
        HOSPITAL_COLLECTION_ID,
        [Query.equal("email", [email])]
      );

      res.status(200).json({
        success: true,
        message: "Login successful!",
        role: Role.HOSPITAL,
        hospital: hospital.documents[0],
        session,
      });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const PatientSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName, phone } = req.body;

    const { error } = patientSignUpSchema.validate(req.body);
    if (error) return next(new ErrorHandler(400, error.details[0].message));

    try {
      const patientList = await users.list([Query.equal("email", email)]);

      if (patientList.total > 0) {
        return next(new ErrorHandler(400, "Email is already registered."));
      }

      const patient = await users.create(
        ID.unique(),
        email,
        phone,
        password,
        fullName
      );
      try {
        await database.createDocument(
          DATABASE_ID,
          PATIENT_COLLECTION_ID,
          ID.unique(),
          {
            userId: patient.$id,
            email,
            phone,
            fullName,
          }
        );
      } catch (documentError) {
        await users.delete(patient.$id);
        throw documentError;
      }

      const session = await account.createEmailPasswordSession(email, password);

      res.status(201).json({
        success: true,
        message: "Sign up successful!.",
        role: Role.PATIENT,
        patient,
        session,
      });
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
      const session = await account.createEmailPasswordSession(email, password);
      const patient = await database.listDocuments(
        DATABASE_ID,
        PATIENT_COLLECTION_ID,
        [Query.equal("email", [email])]
      );
      res.status(200).json({
        success: true,
        message: "Login successful!",
        role: Role.PATIENT,
        patient,
        session,
      });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);




export const BulkHospitalSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hospitals  = req.body;

    if (!Array.isArray(hospitals)) {
      return next(new ErrorHandler(400, 'Invalid input format. Expected an array of hospitals.'));
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
        results.push({ email, success: false, message: error.details[0].message });
        continue;
      }

      try {
        const hospitalList = await users.list([Query.equal("email", email)]);

        if (hospitalList.total > 0) {
          results.push({ email, success: false, message: "Email is already registered." });
          continue;
        }

        const hospital = await users.create(
          ID.unique(),
          email,
          phone,
          password,
          hospitalName
        );

        try {
          await database.createDocument(
            DATABASE_ID,
            HOSPITAL_COLLECTION_ID,
            ID.unique(),
            {
              userId: hospital.$id,
              email,
              phone,
              hospitalName: hospitalName.toString(),
              hospitalNumber,
              coordinates,
            }
          );

          const session = await account.createEmailPasswordSession(email, password);

          results.push({
            email,
            success: true,
            message: "Sign up successful! Please check your email for confirmation.",
            role: Role.HOSPITAL,
            session,
            hospital,
          });
        } catch (documentError) {
          await users.delete(hospital.$id);
          results.push({ email, success: false, message: documentError });
        }
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
