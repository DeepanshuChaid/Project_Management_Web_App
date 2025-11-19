import { asyncHandler } from "../middleware/asyncHandlerMiddleware.js";
import HTTPSTATUS from "../configs/http.config.js";
import {
  createWorkspaceService,
  getAllUserWorkspacesUserIsMemberService,
  getWorkspaceAnalyticsService,
  getWorkspaceMemberService,
} from "../service/workspace.service.js";
import {
    changeRoleSchema,
  createWorkspaceSchema,
  workspaceIdSchema,
} from "../validation/workspace.validation.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js";
import { getWorkspaceByIdService } from "../service/workspace.service.js";
import { roleGaurd } from "../utils/roleGuard.utils.js";

export const createWorkspaceController = asyncHandler(async (req, res) => {
  const body = createWorkspaceSchema.parse(req.body);

  const userId = req.user?.id;

  const { workspace } = await createWorkspaceService(userId, body);

  if (!workspace)
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Failed to create workspace",
      error: "please check service function of workspace file",
    });

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Workspace created successfully",
    workspace,
  });
});

// controller to get all workspaces a user is a member of
export const getAllUserWorkspacesUserIsMemberController = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    const { workspaces } =
      await getAllUserWorkspacesUserIsMemberService(userId);

    if (!workspaces)
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Failed to fetch workspaces",
        error: "please check service function of workspace file",
      });

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspaces fetched successfully",
      workspaces,
    });
  },
);

// controller for getting user workspce data by id
export const getWorkspaceByIdController = asyncHandler(async (req, res) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);

  const userId = req.user.id;

  if (!userId)
    res
      .status(HTTPSTATUS.UNAUTHORIZED)
      .json({
        message:
          "Please login to get your workspace cuz thats how we work here understood?",
      });

  await getMemberRoleInWorkspace(userId, workspaceId);

  const { workspace } = await getWorkspaceByIdService(workspaceId);

  if (!workspace)
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Failed to get workspace by Id",
      error:
        "please check service function nameed getworkspacebyid in workspace file",
    });

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace fetched successfully",
    workspace,
  });
});

// controller for getting all members of a workspace
export const getWorkspaceMembersController = asyncHandler(async (req, res) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const userId = req.user.id;

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

  roleGaurd(role, ["VIEW_ONLY"]);

  const { members } = await getWorkspaceMemberService(workspaceId);

  if (!members)
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Failed to get workspace members",
      error:
        "please check service function named getWorkspaceMemberService in workspace file",
    });

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace members fetched successfully",
    members,
    role,
  });
});

// CONTORLLER FOR GETTING WORKSPACE ANALYTICS
export const getWorkspaceAnalyticsController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user.id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGaurd(role, ["VIEW_ONLY"]);

    const { totalTasks, overdueTasks, completedTasks } =
      await getWorkspaceAnalyticsService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace analytics fetched successfully",
      analytics: { totalTasks, overdueTasks, completedTasks },
    });
  },
);


// CHANGE WORKSPACE MEMBER ROLE 
export const changeWorkspaceMemberRoleController = asyncHandler(async (req, res) => {
   const workspaceId = workspaceIdSchema.parse(req.params.id)
   const userId = req.user.id
  
   const {roleId, memberId} = changeRoleSchema.parse(req.body)


  const {role} = await getMemberRoleInWorkspace(userId, workspaceId)
  roleGaurd(role, ["CHANGE_MEMBER_ROLE"])


  const {member} = await changeMemberRoleService(workspaceId, memberId, roleId)

  res.status(HTTPSTATUS.OK).json({
    message: "Member role changed successfully",
    member
  })
  
})
