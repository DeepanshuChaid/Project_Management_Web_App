import { Router } from "express";
import {
  createTaskController,
  updateTaskController,
  getAllTaskController,
  getTaskByIdController,
  deleteTaskController
} from "../controllers/task.controller.js";

const taskRoutes = Router();

taskRoutes.post("/project/:projectId/workspace/:workspaceId/create",
  createTaskController,
);

// UPDATE
taskRoutes.put("/:id/project/:projectId/workspace/:workspaceId/update",
  updateTaskController,
);

// GET ALL TASKS IN PROJECT AND FILTERATION
taskRoutes.get("/workspace/:workspaceId/all", getAllTaskController)

// GET TASK BY ID
taskRoutes.get("/:id/project/:projectId/workspace/:workspaceId", getTaskByIdController)

// DELETE TASK BY ID
taskRoutes.delete("/:id/project/:projectId/workspace/:workspaceId/delete", deleteTaskController)

export default taskRoutes;
