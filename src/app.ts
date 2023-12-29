import cookieParse from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import "reflect-metadata";
import logger from "./config/logger";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenants";

const app = express();

// Static files
app.use(express.static("public"));

// Middlewares
app.use(express.json());
app.use(cookieParse());

// Routes
app.get("/", async (req, res) => {
  res.send("Welcome to the club!");
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
