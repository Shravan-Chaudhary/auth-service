import createHttpError from "http-errors";
import { HttpStatus } from "../enums/http-codes";

export function createBadRequestError(message?: string) {
    return createHttpError(
        HttpStatus.BAD_REQUEST,
        message ?? "Unexpected error occurred",
    );
}

export function createConflictError(message?: string) {
    return createHttpError(
        HttpStatus.CONFLICT,
        message ?? "resource conflict error",
    );
}

export function createUnauthorizedError(message?: string) {
    return createHttpError(HttpStatus.UNAUTHORIZED, message ?? "unauthorized");
}

export function createForbiddenError(message?: string) {
    return createHttpError(HttpStatus.FORBIDDEN, message ?? "forbidden");
}

export function createNotFoundError(message?: string) {
    return createHttpError(
        HttpStatus.NOT_FOUND,
        message ?? "resource not found",
    );
}

export function createInternalServerError(message?: string) {
    return createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        message ?? "internal server error",
    );
}

export function createDatabaseError(message?: string) {
    return createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        message ?? "database error occured",
    );
}
