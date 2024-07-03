import Config from "../config/config.js";
import ErrorHandler from "../handlers/errorHandler.js";
import { Request, Response, NextFunction } from "express";
import Hospital from "../models/hospital.js";
import Patient from "../models/patient.js";
import catchAsync from "./catchAsync.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { User } from "../types.js";

const getInfo = async (id: string, isHospital: boolean): Promise<User> => {
  try {
    let entity;
  
    if (isHospital) {
      entity = await Hospital.findById(id);
    } else {
      entity = await Patient.findById(id);
    }

    if (!entity) {
      throw new Error("Entity not found");
    }
    return entity;
  } catch (error) {
    throw error;
  }
};
const authMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { JWT_SECRETE_KEY } = Config.JWT;
    let token;
    let headers: string = req.headers["Authorization"];

    if (headers && headers.startsWith("Bearer")) {
      token = headers.split(":")[1]; // Split by space to get the token part
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    const role = req.headers.role;
    if (!role || typeof role !== "string") {
      return next(new ErrorHandler(401, "Missing entity role"));
    }

    if (!token) {
      return next(new ErrorHandler(401, "Missing auth token"));
    }

    try {
      const verified: any = await promisify(jwt.verify)(token, JWT_SECRETE_KEY);
      req.user = await getInfo(verified?.id, role.toLowerCase() === "hospital");
    } catch (error: any) {
      return next(new ErrorHandler(401, error.message));
    }

    next();
  }
);

export default authMiddleware;
