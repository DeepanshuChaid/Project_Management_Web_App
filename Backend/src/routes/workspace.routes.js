import {Router} from "express"
import {createWorkspaceController, getAllUserWorkspacesUserIsMemberController, getUserWorkspaceDataByIdController} from  "../controllers/workspace.controller.js"

const workspaceRoutes = Router()

workspaceRoutes.post("/create/new", createWorkspaceController)

workspaceRoutes.get("/all", getAllUserWorkspacesUserIsMemberController)

workspaceRoutes.get("/:id", getUserWorkspaceDataByIdController)

export default workspaceRoutes