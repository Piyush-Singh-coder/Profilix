import { BlogStatus } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import * as blogService from "../services/blog.service";
import { sendSuccess } from "../utils/response";

export const listPublishedBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const result = await blogService.listPublishedBlogs(page, limit);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getPublishedBlogBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await blogService.getPublishedBlogBySlug(req.params.slug as string);
    sendSuccess(res, post);
  } catch (error) {
    next(error);
  }
};

export const listAllBlogsForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const result = await blogService.listAllBlogsForAdmin(page, limit);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await blogService.createBlog(req.user!.id, req.body);
    sendSuccess(res, post, "Blog post created", 201);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await blogService.updateBlog(req.params.id as string, req.body);
    sendSuccess(res, post, "Blog post updated");
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await blogService.deleteBlog(req.params.id as string);
    sendSuccess(res, null, "Blog post deleted");
  } catch (error) {
    next(error);
  }
};

export const setBlogStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await blogService.setBlogStatus(
      req.params.id as string,
      req.body.status as BlogStatus
    );
    sendSuccess(res, post, `Blog post ${post.status.toLowerCase()}`);
  } catch (error) {
    next(error);
  }
};
