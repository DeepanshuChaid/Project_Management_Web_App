import { Router } from "express";
import {
  createProjectController,
  getAllProjectsInWorkspaceController,
  getProjectByIdAndWorkspaceIdController,
  getProjectAnalyticsController,
  updateProjectByIdController,
  deleteProjectByIdController
} from "../controllers/project.controller.js";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectController);

projectRoutes.get(
  "/workspace/:workspaceId/all",
  getAllProjectsInWorkspaceController,
);

projectRoutes.put("/:id/workspace/:workspaceId/update", updateProjectByIdController)

projectRoutes.delete("/:id/workspace/:workspaceId/delete", deleteProjectByIdController)

projectRoutes.get(
  "/:id/workspace/:workspaceId/analytics",
  getProjectAnalyticsController,
);

projectRoutes.get(
  "/:id/workspace/:workspaceId",
  getProjectByIdAndWorkspaceIdController,
);

export default projectRoutes;
