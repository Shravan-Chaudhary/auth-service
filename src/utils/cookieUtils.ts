import { Response } from "express";

export const setCookie = (res: Response, name: string, value: string, maxAge: number) => {
  res.cookie(name, value, {
    domain: "localhost",
    sameSite: "strict",
    maxAge: maxAge,
    httpOnly: true,
  });
};
