import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../../types";
import CreateHttpError from "../errors/http-exceptions";

const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        const roleFromToken = _req.auth.role;

        if (!roles.includes(roleFromToken)) {
            next(
                CreateHttpError.UnauthorizedError(
                    "You don't have permission to access.",
                ),
            );
        }
        next();
    };
};

export default canAccess;
