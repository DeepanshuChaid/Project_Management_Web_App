import {Router} from "express"
import {createWorkspaceController, getAllUserWorkspacesUserIsMemberController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController, changeWorkspaceMemberRoleController} from  "../controllers/workspace.controller.js"

const workspaceRoutes = Router()

workspaceRoutes.post("/create/new", createWorkspaceController)
workspaceRoutes.put("/change/member/role/:id", changeWorkspaceMemberRoleController)


workspaceRoutes.get("/all", getAllUserWorkspacesUserIsMemberController)
workspaceRoutes.get("/members/:id", getWorkspaceMembersController)



workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController)

workspaceRoutes.get("/:id", getWorkspaceByIdController)

export default workspaceRoutes

