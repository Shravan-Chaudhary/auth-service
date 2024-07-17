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
};
