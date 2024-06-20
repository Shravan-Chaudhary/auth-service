import "reflect-metadata";
import express, { Request, Response } from "express";
import authRouter from "./Auth/authRoute";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";

// TODO: fix bcrypt with bcryptjs
// TODO: docker compose notes
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/auth", authRouter);

app.use(globalErrorHandler);

export default app;
