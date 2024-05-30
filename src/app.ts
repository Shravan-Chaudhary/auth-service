import "reflect-metadata";
import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";

const app = express();
// TODO: cookie parser

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/auth", authRouter);

app.use(globalErrorHandler);

export default app;
