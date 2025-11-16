import { asyncHandler } from "../middleware/asyncHandlerMiddleware.js"
import HTTPSTATUS from "../configs/http.config.js"
import { getCurrentUserService } from "../service/user.service.js"

export const getCurrentUserController  = asyncHandler(async(req, res) => {

  const userId = req.user.id

  const {user} = await getCurrentUserService(userId)

  return res.status(HTTPSTATUS.OK).json({
    message: "User fetched successfully",
    user
  })
})