import { Router } from "express";
import * as blogController from "../controllers/blog.controller";
import { requireBlogAdmin } from "../middlewares/admin.middleware";
import { protect } from "../middlewares/auth.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createBlogSchema,
  publishBlogSchema,
  updateBlogSchema,
} from "../validators/blog.validator";

const router = Router();

router.get("/", blogController.listPublishedBlogs);
router.get(
  "/admin/all",
  protect,
  requireBlogAdmin,
  apiLimiter,
  blogController.listAllBlogsForAdmin
);
router.post(
  "/",
  protect,
  requireBlogAdmin,
  apiLimiter,
  validate(createBlogSchema),
  blogController.createBlog
);
router.put(
  "/:id",
  protect,
  requireBlogAdmin,
  apiLimiter,
  validate(updateBlogSchema),
  blogController.updateBlog
);
router.patch(
  "/:id/status",
  protect,
  requireBlogAdmin,
  apiLimiter,
  validate(publishBlogSchema),
  blogController.setBlogStatus
);
router.delete("/:id", protect, requireBlogAdmin, apiLimiter, blogController.deleteBlog);

router.get("/:slug", blogController.getPublishedBlogBySlug);

export default router;
