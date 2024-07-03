import { createToken } from "./jwt.js";
import Config from "../config/config.js";
import ErrorHandler from "../handlers/errorHandler.js";
import { Request, Response, NextFunction } from "express";
import { User } from "../types.js";
const { SESSION_MAX_AGE } = Config.SESSION;

export const createSession = async (user: User, status: number, res: Response, next: NextFunction) => {
  try {
    const accessToken = createToken(user);
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + Number(SESSION_MAX_AGE) * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV !== "development" ? "lax" as "lax" : undefined,
    };

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .status(status)
      .json({
        success: true,
        user,
        role: user?.role,
        accessToken,
      });
  } catch (err: any) {
    next(new ErrorHandler(500, err.message));
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  res.clearCookie("accessToken").json({
    success: true,
    message: "Logout successfully",
  });
};
