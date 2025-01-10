import { config } from "dotenv";
import path from "path";

config({
    path: path.join(
        __dirname,
        `../../.env.${process.env.NODE_ENV ?? "development"}`,
    ),
});

const {
    ENV,
    PORT,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    REFRESH_TOKEN_SECRET,
    PRIVATE_KEY,
    JWKS_URI,
    CORS_ADMIN_URL,
    CORS_CLIENT_URL,
    MAIN_DOMAIN,
} = process.env;

export const Config = {
    ENV,
    PORT,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    REFRESH_TOKEN_SECRET,
    PRIVATE_KEY,
    JWKS_URI,
    CORS_CLIENT_URL,
    CORS_ADMIN_URL,
    MAIN_DOMAIN,
};
