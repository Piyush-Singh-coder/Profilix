import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/database";
import { UnauthorizedError } from "../utils/errors";

interface JwtPayload {
  userId: string;
}

// Extend Express Request to carry the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        fullName: string;
        isVerified: boolean;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.jwt as string | undefined;

    if (!token) {
      throw new UnauthorizedError("Not authenticated. Please log in.");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError("User no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
