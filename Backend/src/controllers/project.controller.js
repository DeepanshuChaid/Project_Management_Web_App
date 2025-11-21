import { asyncHandler } from "../middleware/asyncHandlerMiddleware.js";
import HTTPSTATUS from "../configs/http.config.js";
import { createProjectSchema } from "../validation/project.validation.js";
import { workspaceIdSchema } from "../validation/workspace.validation.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js"
import { roleGaurd } from "../utils/roleGuard.utils.js";
import { createProjectService } from "../service/project.service.js";

export const createProjectController = asyncHandler(async (req, res) => {
  const body = createProjectSchema.parse(req.body)
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
  const userId = req.user.id

  if (!userId || !workspaceId) throw new Error("User or workspace not found")

  const role = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGaurd(role, ["CREATE_PROJECT"])

  const { project } = await createProjectService(userId, workspaceId, body)

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Project created successfully",
    project
  })
  
})