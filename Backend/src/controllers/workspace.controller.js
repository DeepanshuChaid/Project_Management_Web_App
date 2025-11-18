import {asyncHandler} from "../middleware/asyncHandlerMiddleware.js"
import HTTPSTATUS from "../configs/http.config.js"
import { createWorkspaceService, getAllUserWorkspacesUserIsMemberService } from "../service/workspace.service.js"
import { createWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation.js"

export const createWorkspaceController = asyncHandler(
  async (req, res) => {
    const body = createWorkspaceSchema.parse(req.body)

    const userId = req.user?.id

    const {workspace} = await createWorkspaceService(userId, body)

    if (!workspace) return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Failed to create workspace",
      error: "please check service function of workspace file"
    })

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

  if (!workspaces) return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Failed to fetch workspaces",
    error: "please check service function of workspace file"
  })

  
  return res.status(HTTPSTATUS.OK).json({
    message: "Workspaces fetched successfully",
    workspaces
  })
})



// controller for getting user workspce data by id
export const  getWorkspaceByIdController = asyncHandler(async (req, res) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id)

  const userId = req.user?.id

  await getMemberRoleInWorkspace(userId, workspaceId)

  const {workspace} = await getWorkspaceByIdController(workspaceId)

  if (!workspace) return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Failed to get workspace by Id",
    error: "please check service function nameed getworkspacebyid in workspace file"
  })

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace fetched successfully",
    workspace
  })
})