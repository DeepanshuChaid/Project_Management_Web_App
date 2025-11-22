import {asyncHandler} from "../middleware/asyncHandlerMiddleware"

export const createTaskController = asyncHandler(async (req, res) => {
  const {projectId, workspaceId} = req.params
  
})