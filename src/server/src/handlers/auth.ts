import catchAsync from "../middlewares/catchAsync.js";
import {
  Client,
  Users,
  Databases,
  ID,
  Account,
  Query,
} from "node-appwrite";
import Config from "../config/config.js";
import ErrorHandler from "./errorHandler.js";
import { loginSchema, signUpSchema } from "../schemas/index.js";
import { Request, Response, NextFunction } from 'express';
const client = new Client()
  .setEndpoint(Config.APPWRITE.APPWRITE_ENDPOINT)
  .setProject(Config.APPWRITE.PROJECT_ID)
  .setKey(Config.APPWRITE.APPWRITE_SECRET);

const users = new Users(client);
const databases = new Databases(client);
const account = new Account(client);

const { DATABASE_ID, HOSPITAL_COLLECTION_ID, MAIL_FUNCTION_ID } =
  Config.APPWRITE;

export const Signup = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { email, password, hospitalName, phone, hospitalNumber, coordinates } =
    req.body;

  const { error } = signUpSchema.validate(req.body);
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

    // Send welcome email using Appwrite Functions
    /* await functions.createExecution(
      MAIL_FUNCTION_ID,
      JSON.stringify({ email, hospitalName, hospitalNumber })
    );
*/
    res.status(201).json({
      success: true,
      message: "Sign up successful! Please check your email for confirmation.",
      session,
    });
  } catch (error:any) {
    if (error.code === 409) {
      return next(new ErrorHandler(400, "Email is already registered."));
    }
    return next(new ErrorHandler(500, "Internal server error.", error));
  }
});

export const Login = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { email, password } = req.body;
 
  const { error } = loginSchema.validate(req.body);
  if (error) return next(new ErrorHandler(400, error.details[0].message));

  try {
    const session = await account.createEmailPasswordSession(email, password);
    res
      .status(200)
      .json({ success: true, message: "Login successful!", session });
  } catch (error:any) {
    if (error.code === 401) {
      return next(new ErrorHandler(400, "Invalid email or password."));
    }
    return next(new ErrorHandler(500, "Internal server error.", error));
  }
});
