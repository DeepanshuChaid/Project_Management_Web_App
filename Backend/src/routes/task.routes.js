import { Router } from "express";
import {
  createTaskController,
  updateTaskController,
  getAllTaskController
} from "../controllers/task.controller.js";

const taskRoutes = Router();

taskRoutes.post("/project/:projectId/workspace/:workspaceId/create",
  createTaskController,
);

// UPDATE
taskRoutes.put("/:id/project/:projectId/workspace/:workspaceId/update",
  updateTaskController,
);

taskRoutes.get("/workspace/:workspaceId/all", getAllTaskController)

export default taskRoutes;
