import createHttpError from "http-errors";

export function createBadRequestError(message?: string) {
    return createHttpError(500, message ?? "Unexpected error occurred");
}

export function createConflictError(message?: string) {
    return createHttpError(409, message ?? "resource conflict error");
}

export function createUnauthorizedError(message?: string) {
    return createHttpError(401, message ?? "unauthorized");
}

export function createForbiddenError(message?: string) {
    return createHttpError(403, message ?? "forbidden");
}

export function createNotFoundError(message?: string) {
    return createHttpError(404, message ?? "resource not found");
}

export function createInternalServerError(message?: string) {
    return createHttpError(500, message ?? "internal server error");
}

export function createDatabaseError(message?: string) {
    return createHttpError(500, message ?? "error while creating");
}
