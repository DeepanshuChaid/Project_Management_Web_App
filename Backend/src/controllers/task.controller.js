import { asyncHandler } from "../middleware/asyncHandlerMiddleware.js";
import { createTaskSchema } from "../validation/task.validation.js";
import { projectIdSchema } from "../validation/project.validation.js";
import { workspaceIdSchema } from "../validation/workspace.validation.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js";
import { roleGaurd } from "../utils/roleGuard.utils.js";
import { createTaskService } from "../service/task.service.js";
import HTTPSTATUS from "../configs/http.config.js";


export const createTaskController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const body = createTaskSchema(req.body);
  const projectId = projectIdSchema(req.params.projectId);
  const workspaceId = workspaceIdSchema(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGaurd(role, ["CREATE_TASK"]);

  const {task} = await createTaskService(userId, workspaceId, projectId, body)

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Task created successfully",
    task
  })
});
