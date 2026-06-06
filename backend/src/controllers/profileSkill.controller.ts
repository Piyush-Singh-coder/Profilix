import { Request, Response, NextFunction } from "express";
import * as profileSkillService from "../services/profileSkill.service";
import { sendSuccess } from "../utils/response";

export const getProfileSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await profileSkillService.getProfileSkills(req.user!.id);
    sendSuccess(res, skills);
  } catch (error) { next(error); }
};

export const createProfileSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await profileSkillService.createProfileSkill(req.user!.id, req.body);
    sendSuccess(res, skill, "Skill category created", 201);
  } catch (error) { next(error); }
};

export const updateProfileSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await profileSkillService.updateProfileSkill(
      req.user!.id,
      req.params.id as string,
      req.body
    );
    sendSuccess(res, skill, "Skill category updated");
  } catch (error) { next(error); }
};

export const deleteProfileSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await profileSkillService.deleteProfileSkill(req.user!.id, req.params.id as string);
    sendSuccess(res, null, "Skill category deleted");
  } catch (error) { next(error); }
};
