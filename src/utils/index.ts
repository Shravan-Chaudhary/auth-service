import { Response } from "express";
import { Config } from "../config";

export const setCookie = (
    res: Response,
    name: string,
    token: string,
    maxAge: number,
) => {
    res.cookie(name, token, {
        domain: Config.MAIN_DOMAIN,
        sameSite: "strict",
        maxAge: maxAge,
        httpOnly: true,
    });
};
