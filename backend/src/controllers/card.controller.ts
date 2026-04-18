import { Request, Response, NextFunction } from "express";
import { generateProfileCard } from "../services/card.service";

type CardSize = "1080x1080" | "1200x628" | "1200x675" | "1920x1080";
type CardTheme = "GLASSMORPHISM" | "NEOBRUTALISM" | "APPLE";

const isValidSize = (value: string): value is CardSize => {
  return ["1080x1080", "1200x628", "1200x675", "1920x1080"].includes(value);
};

const isValidTheme = (value: string): value is CardTheme => {
  return ["GLASSMORPHISM", "NEOBRUTALISM", "APPLE"].includes(value);
};

export const exportCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const username = String(req.params.username);
    const rawSize = req.query.size;
    const rawTheme = req.query.theme;

    let size: CardSize = "1080x1080";
    if (typeof rawSize === "string" && isValidSize(rawSize)) {
      size = rawSize;
    } else if (Array.isArray(rawSize) && typeof rawSize[0] === "string" && isValidSize(rawSize[0])) {
      size = rawSize[0];
    }

    let theme: CardTheme | undefined = undefined;
    if (typeof rawTheme === "string" && isValidTheme(rawTheme)) {
      theme = rawTheme;
    } else if (Array.isArray(rawTheme) && typeof rawTheme[0] === "string" && isValidTheme(rawTheme[0])) {
      theme = rawTheme[0];
    }

    const buffer = await generateProfileCard(username, size, theme);

    res.set({
      "Content-Type": "image/png",
      "Content-Length": buffer.length,
      "Cache-Control": "public, s-maxage=300, max-age=60",
      "Content-Disposition": `inline; filename="profile-card-${size}.png"`,
    });
    res.end(buffer);
  } catch (error) {
    next(error);
  }
};
