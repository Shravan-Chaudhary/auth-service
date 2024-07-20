import { Response } from "express";

export const setCookie = (
    res: Response,
    name: string,
    token: string,
    maxAge: number,
) => {
    res.cookie(name, token, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: maxAge,
        httpOnly: true,
    });
};
