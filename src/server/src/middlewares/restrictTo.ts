import ErrorHandler from "../handlers/errorHandler.js";
import { Request, Response, NextFunction } from 'express';

const AdminOnly = (roles = ["ADMIN"]) => {
  return (req:any, res:Response, next:NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          401,
          "Unauthorized. Only admins can perform this action.",
        )
      );
    }

    next();
  };
};

export default AdminOnly ;
