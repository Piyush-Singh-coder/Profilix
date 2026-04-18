import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: Record<string, unknown>
): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
};

export const sendError = (
  res: Response,
  error: string,
  statusCode = 500,
  details?: unknown
): Response<ErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    error,
    details,
    meta: { timestamp: new Date().toISOString() },
  });
};
