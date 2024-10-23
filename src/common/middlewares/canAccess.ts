import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../../types";
import CreateHttpError from "../http/httpErrors";

const canAccess = (roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        const roleFromToken = _req.auth.role;

        if (!roles.includes(roleFromToken)) {
            next(
                CreateHttpError.ForbiddenError(
                    "You don't have permission to access this resource.",
                ),
            );
        }
        next();
    };
};

export default canAccess;
