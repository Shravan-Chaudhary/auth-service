import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types";
import createHttpError from "http-errors";

export const canAccess = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest;
    const rolefromToken = _req.auth.role;

    if (!roles.includes(rolefromToken)) {
      const error = createHttpError(403, "You don't have permission to access this resource");
      next(error);
      return;
    }
    next();
  };
};
