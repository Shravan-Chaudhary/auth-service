import { config } from "dotenv";
import path from "path";

config({
    path: path.join(
        __dirname,
        `../../.env.${process.env.NODE_ENV ?? "development"}`,
    ),
});

const {
    NODE_ENV,
    PORT,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    REFRESH_TOKEN_SECRET,
    PRIVATE_KEY,
    JWKS_URI,
    CORS_ORIGINS_ADMIN,
    CORS_ORIGINS,
} = process.env;

export const Config = {
    NODE_ENV,
    PORT,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    REFRESH_TOKEN_SECRET,
    PRIVATE_KEY,
    JWKS_URI,
    CORS_ORIGINS,
    CORS_ORIGINS_ADMIN,
};
