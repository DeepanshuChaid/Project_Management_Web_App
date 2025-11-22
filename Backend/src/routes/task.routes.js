import {Router} from 'express'
import {createTaskController} from '../controllers/task.controller.js'

const taskRoutes = Router()

taskRoutes.post("/projects/:projectId/worksapce/:workspaceId/create", createTaskController)

export default  taskRoutes