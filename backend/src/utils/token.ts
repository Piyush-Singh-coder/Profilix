import jwt from "jsonwebtoken";
import { Response } from "express";
import { env } from "../config/env";

export const generateToken = (userId: string, res: Response): string => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("jwt", token, {
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in ms
    httpOnly: true, // Cannot be accessed by JavaScript — XSS protection
    sameSite: env.NODE_ENV !== "development" ? "none" : "strict",
    secure: env.NODE_ENV !== "development",
  });

  return token;
};

export const clearToken = (res: Response): void => {
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: env.NODE_ENV !== "development" ? "none" : "strict",
    secure: env.NODE_ENV !== "development",
  });
};
