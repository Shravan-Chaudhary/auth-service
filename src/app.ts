import "reflect-metadata";
import express, { Request, Response } from "express";
import authRouter from "./modules/Auth/authRoutes";
import tenantsRouter from "./modules/Tenants/tenantsRoutes";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tenants", tenantsRouter);

app.use(globalErrorHandler);

export default app;
