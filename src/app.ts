import "reflect-metadata";
import express, { Request, Response } from "express";
import authRouter from "./modules/Auth/authRoute";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export default app;
