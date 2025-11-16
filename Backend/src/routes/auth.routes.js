import { Router } from "express"
import passport from "passport"
import {config} from "../configs/app.config.js"
import { googleLoginCallback, loginUserController, registerUserController, logoutUserController } from "../controllers/auth.controller.js"

const failedUrl = `${config.FRONTEND_URL}?status=failure`
const authRoutes = Router()

authRoutes.post("/register", registerUserController)
authRoutes.post("/login", loginUserController)

authRoutes.post("/logout", logoutUserController)

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    failureRedirect: failedUrl
  }),
  (req, res, next) => {
    console.log("Google auth initiated")
    next()    
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
)

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl
  }),
  googleLoginCallback
)


export default authRoutes


