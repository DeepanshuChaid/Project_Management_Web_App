import { asyncHandler } from "../middleware/asyncHandlerMiddleware.js";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validation/task.validation.js";
import { projectIdSchema } from "../validation/project.validation.js";
import { workspaceIdSchema } from "../validation/workspace.validation.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js";
import { roleGaurd } from "../utils/roleGuard.utils.js";
import {
  createTaskService,
  updateTaskService,
  getAllTaskService,
  getTaskByIdService,
  deleteTaskService
} from "../service/task.service.js";
import HTTPSTATUS from "../configs/http.config.js";

export const createTaskController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const body = createTaskSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGaurd(role, ["CREATE_TASK"]);

  const { task } = await createTaskService(
    userId,
    workspaceId,
    projectId,
    body,
  );

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Task created successfully",
    task,
  });
});

export const updateTaskController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const body = updateTaskSchema.parse(req.body);
  const taskId = taskIdSchema.parse(req.params.id);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGaurd(role, ["EDIT_TASK"]);

  const { task } = await updateTaskService(
    workspaceId,
    projectId,
    taskId,
    body,
  );

  return res.status(HTTPSTATUS.OK).json({
    message: "Task updated successfully",
    task,
  });
});

// GET ALL TASKS IN PROJECT
export const getAllTaskController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const filter = {
    projectId: req.query.projectId,
    status: req.query.status ? req.query.status?.split(",") : undefined,
    priority: req.query.priority ? req.query.priority?.split(",") : undefined,
    assignedTo: req.query.assignedTo
      ? req.query.assignedTo?.split(",")
      : undefined,
    keyword: req.query.keyword,
    dueDate: req.query.dueDate,
  };

  const pagination = {
    pageSize: parseInt(req.query.pageSize) || 10,
    pageNumber: parseInt(req.query.pageNumber) || 1,
  };

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGaurd(role, ["VIEW_ONLY"]);

  const result = await getAllTaskService(workspaceId, filter, pagination);

  return res.status(HTTPSTATUS.OK).json({
    message: "Tasks fetched successfully",
    ...result,
  });
});

// GET TASK BY ID
export const getTaskByIdController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const taskId = taskIdSchema.parse(req.params.id);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGaurd(role, ["VIEW_ONLY"]);

  const { task } = await getTaskByIdService(workspaceId, projectId, taskId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Task fetched successfully",
    task,
  });
});

// DELETE A TASK BY ID
export const deleteTaskController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const taskId = taskIdSchema.parse(req.params.id);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGaurd(role, ["DELETE_TASK"]);

  const { task } = await deleteTaskService(workspaceId, projectId, taskId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Task deleted successfully",
    task
  })
})
