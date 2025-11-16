import express from "express"
import cors from "cors"
import "dotenv/config"
// import session from "cookie-session"
import {config} from "./configs/app.config.js"
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js"
import "./configs/passport.config.js"
import passport from "passport"
import authRoutes from "./routes/auth.routes.js"
import session from "express-session"
import prisma from "./prisma.js"


const BASE_PATH = config.BASE_PATH

const app = express()
const PORT = process.env.PORT || 5000


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({credentials: true, origin: config.FRONTEND_ORIGIN}))

// app.use(session({
//   name: "session",
//   keys: [config.SESSION_SECRET],
//   maxAge: 24 * 60 * 60 * 1000,
//   secure: config.NODE_ENV === "production",
//   httpOnly: true,
//   sameSite: "lax"
// }))

app.use(session({
  name: "session",
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax"
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(`${BASE_PATH}/auth`, authRoutes)

app.use(errorHandlerMiddleware)

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  const data = await prisma.user.findMany({include: {accounts: true, workspaces: true}})
  console.log(data)
  console.log("Backend Callback", config.GOOGLE_CALLBACK_URL)
})






