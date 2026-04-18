import rateLimit from "express-rate-limit";

const createLimiter = (max: number, windowMinutes: number, message: string) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });

// Public profile pages — aggressive to prevent scraping
export const publicProfileLimiter = createLimiter(
  100,
  1,
  "Too many requests to this profile. Please try again later."
);

// OG / QR image generation endpoints
export const imageLimiter = createLimiter(
  60,
  1,
  "Image generation rate limit exceeded. Please slow down."
);

// Auth endpoints — prevent brute force
export const authLimiter = createLimiter(
  20,
  1,
  "Too many authentication attempts. Please try again in a minute."
);

// Authenticated CRUD operations
export const apiLimiter = createLimiter(
  200,
  1,
  "API rate limit exceeded. Please slow down."
);
