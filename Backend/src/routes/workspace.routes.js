import {Router} from "express"
import {createWorkspaceController, getAllUserWorkspacesUserIsMemberController} from  "../controllers/workspace.controller.js"

const workspaceRoutes = Router()

workspaceRoutes.post("/create/new", createWorkspaceController)

workspaceRoutes.get("/all", getAllUserWorkspacesUserIsMemberController)

export default workspaceRoutes