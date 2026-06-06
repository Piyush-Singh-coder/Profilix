import { Request, Response, NextFunction } from "express";
import * as customSectionService from "../services/customSection.service";
import { sendSuccess } from "../utils/response";

export const getCustomSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await customSectionService.getCustomSections(req.user!.id);
    sendSuccess(res, sections);
  } catch (error) { next(error); }
};

export const createCustomSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await customSectionService.createCustomSection(req.user!.id, req.body);
    sendSuccess(res, section, "Custom section created", 201);
  } catch (error) { next(error); }
};

export const updateCustomSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await customSectionService.updateCustomSection(
      req.user!.id,
      req.params.id as string,
      req.body
    );
    sendSuccess(res, section, "Custom section updated");
  } catch (error) { next(error); }
};

export const deleteCustomSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await customSectionService.deleteCustomSection(req.user!.id, req.params.id as string);
    sendSuccess(res, null, "Custom section deleted");
  } catch (error) { next(error); }
};
