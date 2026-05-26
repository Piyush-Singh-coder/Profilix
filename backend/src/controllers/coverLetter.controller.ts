import { Request, Response, NextFunction } from "express";
import * as coverLetterService from "../services/coverLetter.service";
import { getResumeData } from "../services/resumeGenerator.service";
import { trackEvent } from "../services/analytics.service";
import { sendSuccess } from "../utils/response";
import { BadRequestError } from "../utils/errors";

export const generateCoverLetter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobTitle, companyName, jobDescription, style } = req.body as {
      jobTitle: string;
      companyName: string;
      jobDescription?: string;
      style: coverLetterService.CoverLetterStyle;
    };

    if (!jobTitle || !companyName) {
      throw new BadRequestError("Job title and company name are required.");
    }

    const content = await coverLetterService.composeCoverLetter({
      userId: req.user!.id,
      jobTitle,
      companyName,
      jobDescription,
      style: style || "CLASSIC",
    });

    // Track analytics event - fire and forget
    trackEvent(req.user!.id, "PROFILE_VIEW", {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      metadata: {
        action: "generate_cover_letter",
        jobTitle,
        companyName,
        style: style || "CLASSIC",
      },
    });

    sendSuccess(res, { content, jobTitle, companyName, style: style || "CLASSIC" }, "Cover letter generated successfully");
  } catch (error) {
    next(error);
  }
};

export const downloadCoverLetter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, jobTitle, companyName, style, format } = req.body as {
      content: string;
      jobTitle: string;
      companyName: string;
      style: coverLetterService.CoverLetterStyle;
      format: "pdf" | "docx";
    };

    if (!content || !jobTitle || !companyName) {
      throw new BadRequestError("Cover letter content, job title, and company name are required for download.");
    }

    // Fetch user details for the header
    const data = await getResumeData(req.user!.id);
    const { user } = data;
    const profile = user.profile;

    const renderArgs = {
      fullName: profile?.displayName || user.fullName,
      email: user.email,
      phoneNumber: profile?.phoneNumber || undefined,
      headline: profile?.headline || undefined,
      style: style || "CLASSIC",
      content,
      jobTitle,
      companyName,
    };

    if (format === "docx") {
      const buffer = await coverLetterService.renderCoverLetterDocx(renderArgs);
      
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="Cover_Letter_${companyName.replace(/\s+/g, "_")}.docx"`);
      res.status(200).send(buffer);
    } else {
      const buffer = await coverLetterService.renderCoverLetterPdf(renderArgs);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="Cover_Letter_${companyName.replace(/\s+/g, "_")}.pdf"`);
      res.status(200).send(buffer);
    }

    // Track analytics event
    trackEvent(req.user!.id, "RESUME_DOWNLOAD", {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      metadata: {
        coverLetter: true,
        format,
        companyName,
        jobTitle,
        style,
      },
    });
  } catch (error) {
    next(error);
  }
};
