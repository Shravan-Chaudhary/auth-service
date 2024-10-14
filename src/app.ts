import "reflect-metadata";
import express, { Request, Response } from "express";
import authRouter from "./modules/Auth/authRoutes";
import tenantsRouter from "./modules/Tenants/tenantsRoutes";
import userRouter from "./modules/Users/userRoutes";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Config } from "./config";

const app = express();

app.use(
    cors({
        origin: [Config.CORS_ORIGINS_ADMIN!],
        credentials: true,
    }),
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth/tenants", tenantsRouter);
app.use("/api/v1/auth/users", userRouter);

app.use(globalErrorHandler);

export default app;
