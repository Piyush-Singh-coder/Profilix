import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

/**
 * Factory that returns a middleware validating req.body against a Zod schema.
 * Errors are passed to the global error handler which formats them uniformly.
 */
export const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error); // global error middleware handles ZodError formatting
      } else {
        next(error);
      }
    }
  };
