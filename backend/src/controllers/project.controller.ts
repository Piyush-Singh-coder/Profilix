import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { sendSuccess } from "../utils/response";

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getProjects(req.user!.id);
    sendSuccess(res, projects);
  } catch (error) { next(error); }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.createProject(req.user!.id, req.body);
    sendSuccess(res, project, "Project created", 201);
  } catch (error) { next(error); }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.updateProject(req.user!.id, req.params.id as string, req.body);
    sendSuccess(res, project, "Project updated");
  } catch (error) { next(error); }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await projectService.deleteProject(req.user!.id, req.params.id as string);
    sendSuccess(res, null, "Project deleted");
  } catch (error) { next(error); }
};

export const togglePin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.togglePin(req.user!.id, req.params.id as string);
    sendSuccess(res, project, `Project ${project.isPinned ? "pinned" : "unpinned"}`);
  } catch (error) { next(error); }
};

export const reorderProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await projectService.reorderProjects(req.user!.id, req.body.projects);
    sendSuccess(res, null, "Projects reordered");
  } catch (error) { next(error); }
};
