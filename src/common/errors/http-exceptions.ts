import createHttpError from "http-errors";
import { HttpStatus } from "../enums/http-codes";

const CreateHttpError = {
    BadRequestError(message?: string) {
        return createHttpError(
            HttpStatus.BAD_REQUEST,
            message ?? "Unexpected error occurred",
        );
    },

    ConflictError(message?: string) {
        return createHttpError(
            HttpStatus.CONFLICT,
            message ?? "resource conflict error",
        );
    },

    UnauthorizedError(message?: string) {
        return createHttpError(
            HttpStatus.UNAUTHORIZED,
            message ?? "unauthorized",
        );
    },

    ForbiddenError(message?: string) {
        return createHttpError(HttpStatus.FORBIDDEN, message ?? "forbidden");
    },

    NotFoundError(message?: string) {
        return createHttpError(
            HttpStatus.NOT_FOUND,
            message ?? "resource not found",
        );
    },

    InternalServerError(message?: string) {
        return createHttpError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message ?? "internal server error",
        );
    },

    DatabaseError(message?: string) {
        return createHttpError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message ?? "database error occured",
        );
    },
};

export default CreateHttpError;
