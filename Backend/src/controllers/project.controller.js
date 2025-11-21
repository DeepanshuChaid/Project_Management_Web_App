import { asyncHandler } from "../middleware/asyncHandlerMiddleware.js";
import HTTPSTATUS from "../configs/http.config.js";
import {
  createProjectSchema,
  projectIdSchema,
} from "../validation/project.validation.js";
import { workspaceIdSchema } from "../validation/workspace.validation.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js";
import { roleGaurd } from "../utils/roleGuard.utils.js";
import {
  createProjectService,
  getAllProjectsInWorkspaceService,
  getProjectByIdAndWorkspaceIdService
} from "../service/project.service.js";

export const createProjectController = asyncHandler(async (req, res) => {
  const body = createProjectSchema.parse(req.body);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user.id;

  if (!userId || !workspaceId) throw new Error("User or workspace not found");

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGaurd(role, ["CREATE_PROJECT"]);

  const { project } = await createProjectService(userId, workspaceId, body);

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Project created successfully",
    project,
  });
});

//  ********************************** //
// GET ALL PROJECTS IN A WORKSPACE
// *********************************** //
export const getAllProjectsInWorkspaceController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user.id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGaurd(role, ["VIEW_ONLY"]);

    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 10;

    const { projects, totalCount, totalPages, skip } =
      await getAllProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

    res.status(HTTPSTATUS.OK).json({
      message: "Projects fetched successfully",
      projects,
      pagination: {
        totalCount,
        totalPages,
        pageSize,
        skip,
        pageNumber,
        limit: pageSize,
      },
    });
  },
);

//  ********************************** //
// GET PROJECT BY ID
// *********************************** //
export const getProjectByIdAndWorkspaceIdController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.id);
    const userId = req.user.id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGaurd(role, ["VIEW_ONLY"]);

    const { project } = await getProjectByIdAndWorkspaceIdService(projectId, workspaceId)

    return res.status(HTTPSTATUS.OK).json({
      message: "Project fetched successfully",
      project,
    })
  },
);
