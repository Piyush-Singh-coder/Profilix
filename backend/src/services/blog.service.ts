import { BlogStatus } from "@prisma/client";
import { prisma } from "../config/database";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";
import { CreateBlogInput, UpdateBlogInput } from "../validators/blog.validator";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeList = (items?: string[]) =>
  Array.from(new Set((items ?? []).map((item) => item.trim()).filter(Boolean)));

const normalizeOptional = (value?: string | null) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const ensureUniqueSlug = async (slug: string, excludeId?: string) => {
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing && existing.id !== excludeId) {
    throw new ConflictError("A blog post with this slug already exists");
  }
};

export const listPublishedBlogs = async (page?: number, limit?: number) => {
  if (page !== undefined && limit !== undefined && page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: BlogStatus.PUBLISHED },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          coverImage: true,
          coverImageAlt: true,
          metaTitle: true,
          metaDescription: true,
          keywords: true,
          tags: true,
          status: true,
          publishedAt: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
      prisma.blogPost.count({
        where: { status: BlogStatus.PUBLISHED },
      }),
    ]);
    return {
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  return prisma.blogPost.findMany({
    where: { status: BlogStatus.PUBLISHED },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      coverImageAlt: true,
      metaTitle: true,
      metaDescription: true,
      keywords: true,
      tags: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
      createdAt: true,
    },
  });
};

export const getPublishedBlogBySlug = async (slug: string) => {
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: BlogStatus.PUBLISHED },
  });

  if (!post) throw new NotFoundError("Blog post");
  return post;
};

export const listAllBlogsForAdmin = async (page?: number, limit?: number) => {
  if (page !== undefined && limit !== undefined && page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        orderBy: [{ updatedAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.blogPost.count(),
    ]);
    return {
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  return prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
};

export const createBlog = async (authorId: string, data: CreateBlogInput) => {
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);
  if (!slug) throw new BadRequestError("Slug could not be generated from title");

  await ensureUniqueSlug(slug);

  const status = data.status as BlogStatus;
  const publishedAt =
    status === BlogStatus.PUBLISHED
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : new Date()
      : null;

  return prisma.blogPost.create({
    data: {
      authorId,
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: normalizeOptional(data.coverImage),
      coverImageAlt: normalizeOptional(data.coverImageAlt),
      metaTitle: normalizeOptional(data.metaTitle),
      metaDescription: normalizeOptional(data.metaDescription),
      keywords: normalizeList(data.keywords),
      tags: normalizeList(data.tags),
      status,
      publishedAt,
    },
  });
};

export const updateBlog = async (blogId: string, data: UpdateBlogInput) => {
  const post = await prisma.blogPost.findUnique({ where: { id: blogId } });
  if (!post) throw new NotFoundError("Blog post");

  const nextSlug = data.slug ? slugify(data.slug) : undefined;
  if (nextSlug) await ensureUniqueSlug(nextSlug, blogId);

  const nextStatus = data.status ? (data.status as BlogStatus) : post.status;
  const explicitPublishedAt = data.publishedAt ? new Date(data.publishedAt) : undefined;
  const publishedAt =
    nextStatus === BlogStatus.PUBLISHED
      ? explicitPublishedAt ?? post.publishedAt ?? new Date()
      : null;

  return prisma.blogPost.update({
    where: { id: blogId },
    data: {
      title: data.title ?? post.title,
      slug: nextSlug ?? post.slug,
      excerpt: data.excerpt ?? post.excerpt,
      content: data.content ?? post.content,
      coverImage:
        data.coverImage !== undefined ? normalizeOptional(data.coverImage) : post.coverImage,
      coverImageAlt:
        data.coverImageAlt !== undefined
          ? normalizeOptional(data.coverImageAlt)
          : post.coverImageAlt,
      metaTitle:
        data.metaTitle !== undefined ? normalizeOptional(data.metaTitle) : post.metaTitle,
      metaDescription:
        data.metaDescription !== undefined
          ? normalizeOptional(data.metaDescription)
          : post.metaDescription,
      keywords: data.keywords !== undefined ? normalizeList(data.keywords) : post.keywords,
      tags: data.tags !== undefined ? normalizeList(data.tags) : post.tags,
      status: nextStatus,
      publishedAt,
    },
  });
};

export const deleteBlog = async (blogId: string) => {
  const post = await prisma.blogPost.findUnique({ where: { id: blogId } });
  if (!post) throw new NotFoundError("Blog post");

  await prisma.blogPost.delete({ where: { id: blogId } });
};

export const setBlogStatus = async (blogId: string, status: BlogStatus) => {
  const post = await prisma.blogPost.findUnique({ where: { id: blogId } });
  if (!post) throw new NotFoundError("Blog post");

  return prisma.blogPost.update({
    where: { id: blogId },
    data: {
      status,
      publishedAt:
        status === BlogStatus.PUBLISHED ? post.publishedAt ?? new Date() : null,
    },
  });
};
