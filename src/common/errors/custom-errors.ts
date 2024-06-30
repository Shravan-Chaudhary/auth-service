import createHttpError from "http-errors";

export function unexpectedError(message?: string) {
    return createHttpError(500, message ?? "Unexpected error occurred");
}
export function creationError(message?: string) {
    return createHttpError(500, message ?? "error while creating");
}

export function conflictError(message?: string) {
    return createHttpError(409, message ?? "resource conflict error");
}
