import {asyncHandler} from "../middleware/asyncHandlerMiddleware.js"
import HTTPSTATUS from "../configs/http.config.js"
import { createWorkspaceService, getAllUserWorkspacesUserIsMemberService } from "../service/workspace.service.js"
import { createWorkspaceSchema } from "../validation/workspace.validation.js"

export const createWorkspaceController = asyncHandler(
  async (req, res) => {
    const body = createWorkspaceSchema.parse(req.body)

    const userId = req.user?.id

    const {workspace} = createWorkspaceService(userId, body)

    return res.status(HTTPSTATUS.CREATED)
    .json({
      message: "Workspace created successfully",
      workspace
    })
  }
)


// controoler to get all workspaces a user is a member of
export const getAllUserWorkspacesUserIsMemberController = asyncHandler(async (req, res) => {
  const userId = req.user.id
  
  const {workspaces} = await getAllUserWorkspacesUserIsMemberService(userId)

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspaces fetched successfully",
    workspaces
  })
})