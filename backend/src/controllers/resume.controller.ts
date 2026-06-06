import { Request, Response, NextFunction } from "express";
import multer from "multer";
import * as resumeService from "../services/resume.service";
import * as resumeGeneratorService from "../services/resumeGenerator.service";
import * as resumeParserService from "../services/resumeParser.service";
import { trackEvent } from "../services/analytics.service";
import { sendSuccess } from "../utils/response";

// Use memory storage — we stream directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB hard limit at multer level
}).single("resume");

export const multerMiddleware = upload;

export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }
    const { fileUrl, cloudinaryId } = await resumeService.uploadResume(req.user!.id, req.file);
    const resume = await resumeService.saveResumeRecord(
      req.user!.id,
      fileUrl,
      cloudinaryId,
      req.file.originalname,
      req.file.size
    );
    sendSuccess(res, resume, "Resume uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const parseResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }
    if (req.file.mimetype !== "application/pdf") {
      res.status(400).json({ success: false, error: "Only PDF files are allowed" });
      return;
    }

    // 1. Parse PDF text
    const text = await resumeParserService.parseResumeText(req.file.buffer);
    
    // 2. Call LLM to extract structured JSON
    const parsedData = await resumeParserService.extractStructuredDetails(text);

    // 3. Save details to database
    await resumeParserService.autoFillUserProfile(req.user!.id, parsedData);

    sendSuccess(res, parsedData, "Resume parsed and profile updated successfully", 200);
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await resumeService.getResume(req.user!.id);
    // Track resume download — fire and forget
    trackEvent(req.user!.id, "RESUME_DOWNLOAD", {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });
    sendSuccess(res, resume);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await resumeService.deleteResume(req.user!.id);
    sendSuccess(res, null, "Resume deleted");
  } catch (error) {
    next(error);
  }
};

export const generateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { format, templateType, activeTheme, jobDescription, useAI } = req.body as {
      format: "pdf" | "docx";
      templateType: "ATS" | "DESIGN";
      activeTheme?: string;
      jobDescription?: string;
      useAI?: boolean;
    };

    const { buffer, filename, contentType } = await resumeGeneratorService.generateResumeFile({
      userId: req.user!.id,
      format,
      templateType,
      activeTheme,
      jobDescription,
      useAI,
    });

    // Track resume download — fire and forget
    trackEvent(req.user!.id, "RESUME_DOWNLOAD", {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      metadata: {
        generated: true,
        format,
        useAI: Boolean(useAI),
      },
    });

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(buffer);
  } catch (error) {
    next(error);
  }
};
