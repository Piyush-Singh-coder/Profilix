import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/errors";

const ADMIN_USERNAME = "pmiaynushi";
const ADMIN_EMAIL = "pmiaynushi@gmail.com";

export const requireBlogAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;

  if (!user || (user.username !== ADMIN_USERNAME && user.email !== ADMIN_EMAIL)) {
    throw new ForbiddenError("Only the blog admin can manage posts");
  }

  next();
};
