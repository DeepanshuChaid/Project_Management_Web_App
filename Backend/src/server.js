import express from "express";
import cors from "cors";
import "dotenv/config";
// import session from "cookie-session"
import { config } from "./configs/app.config.js";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import "./configs/passport.config.js";
import passport from "passport";
import authRoutes from "./routes/auth.routes.js";
import session from "express-session";
import prisma from "./prisma.js";
import userRoutes from "./routes/user.routes.js";
import isAuthenticatedMiddleware from "./middleware/isAuthenticatedMiddleware.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import memberRoutes from "./routes/member.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

const BASE_PATH = config.BASE_PATH;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: config.FRONTEND_ORIGIN }));

// app.use(session({
//   name: "session",
//   keys: [config.SESSION_SECRET],
//   maxAge: 24 * 60 * 60 * 1000,
//   secure: config.NODE_ENV === "production",
//   httpOnly: true,
//   sameSite: "lax"
// }))

app.use(
  session({
    name: "session",
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticatedMiddleware, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticatedMiddleware, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticatedMiddleware, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticatedMiddleware, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticatedMiddleware, taskRoutes)

app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  const data = await prisma.user.findMany({
    include: { accounts: true, workspaces: { include: { members: true, projects: true } } },
  });
  // console.log(data);
  // console.log(data[1].workspaces[0]);
  // console.log(data[1].workspaces[0].members);
  // console.log("Backend Callback", config.GOOGLE_CALLBACK_URL);

  const projects = await prisma.project.findMany({
    where: { workspaceId: "ad806b79-f60a-4c43-8d94-36953764ec13" },
    orderBy: { createdAt: "desc" }, 
    include: {
      createdBy: true,
      workspace: true,
      tasks: true,
    }
  })
  console.log(projects)

  // const project = await prisma.project.findFirst({
  //   where: {
  //     id: "fbe31699-6ffa-4f2d-a8d2-7f5628cb801a",
  //     workspaceId: "ad806b79-f60a-4c43-8d94-36953764ec13",
  //   },
  // });

  // console.log(project)
  
});



