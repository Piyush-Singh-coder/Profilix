import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Known operational errors (AppError subclasses)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      meta: { timestamp: new Date().toISOString() },
    });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: err.flatten().fieldErrors,
      meta: { timestamp: new Date().toISOString() },
    });
    return;
  }

  // Prisma unique constraint violation
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.join(", ") ?? "field";
      res.status(409).json({
        success: false,
        error: `A record with this ${field} already exists`,
        meta: { timestamp: new Date().toISOString() },
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        error: "Record not found",
        meta: { timestamp: new Date().toISOString() },
      });
      return;
    }
  }

  // Fallback: unknown/unexpected errors
  res.status(500).json({
    success: false,
    error: "Internal server error",
    meta: { timestamp: new Date().toISOString() },
  });
};
