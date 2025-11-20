import { asyncHandler } from "../middleware/asyncHandlerMiddleware.js";
import { z } from "zod";
import { joinWorkspaceByInviteService } from "../service/member.service.js";
import HTTPSTATUS from "../configs/http.config.js";

export const joinWorkspaceController = asyncHandler(async (req, res) => {
  const inviteCode = z.string().parse(req.params.inviteCode);
  const userId = req.user.id;

  const {workspaceId, role} = await joinWorkspaceByInviteService(userId, inviteCode)

  res.status(HTTPSTATUS.OK).json({
    message: "Joined workspace successfully",
    workspaceId,
    role
  })
  
});
