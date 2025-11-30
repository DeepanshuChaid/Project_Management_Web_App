import { asyncHandler } from "../middleware/asyncHandlerMiddleware.js"
import {config} from "../configs/app.config.js"
import { registerUserSchema } from "../validation/auth.validation.js";
import HTTPSSTATUS from "../configs/http.config.js";
import { registerUserService } from "../service/auth.service.js";
import passport from "passport"

// google login callback
export const googleLoginCallback = asyncHandler(
  async (req, res) => {
    const currentWorkspace = req.user?.currentWorkspace

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`)
    
  }
)


// register user controller
export const registerUserController = asyncHandler(async (req, res) =>{
  const body = registerUserSchema.parse({
    ...req.body,
  })

  await registerUserService(body);

  return res.status(HTTPSSTATUS.CREATED).json({
    message: "User registered successfully"
  })
})


// login user controller
export const loginUserController = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) return res.status(401).json({ message:  "Invalid email or password" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log(err)
      return res.status(200).json({
        message: "Login successful",
        user
      });
    });
  })(req, res, next); // <--- important!
});


// logout user controller
export const logoutUserController = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("Logout Error", err)
      return res.status(200).json({
        error: "failed to logout"
      })
    }

    req.session = null;
    return res.status(200).json({
      message: "Logout successful"
    })

  })
})