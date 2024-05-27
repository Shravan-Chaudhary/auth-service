import { Request, Response } from "express";

export class AuthController {
    public register(_req: Request, res: Response) {
        res.status(201).json({ message: "success" });
    }
}
