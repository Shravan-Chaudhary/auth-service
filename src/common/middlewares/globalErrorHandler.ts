import { HttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";
import createErrorObject from "../utils/errorObject";
// import { httpResponse } from "../http";

export const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const errorObject = createErrorObject(err, req);
    res.status(errorObject.statusCode).json(errorObject);
};
