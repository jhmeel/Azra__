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
const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID)
  .setKey(Config.APPWRITE.APPWRITE_SECRET);

const users = new Users(client);
const databases = new Databases(client);
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

      await databases.createDocument(
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

      res.status(201).json({
        success: true,
        message:
          "Sign up successful! Please check your email for confirmation.",
        session,
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
      res
        .status(200)
        .json({ success: true, message: "Login successful!", session });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const PatientSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName, phone } = req.body;
    console.log(email, password, fullName, phone);
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

      await databases.createDocument(
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

      const session = await account.createEmailPasswordSession(email, password);

      res.status(201).json({
        success: true,
        message: "Sign up successful!.",
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
      res
        .status(200)
        .json({ success: true, message: "Login successful!", session });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);
