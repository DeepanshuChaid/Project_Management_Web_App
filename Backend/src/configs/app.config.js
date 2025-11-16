import { getEnv } from "../utils/get-env.js";

const appConfig = ()  => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", 3000),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  POSTGRESS_URL: getEnv("POSTGRESS_URL", ""),

  SESSION_SECRET: getEnv("SESSION_SECRET"),
  SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN", "2d"),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", "iamam"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET", "ibegantohate HATE"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL", "and therefore i am am"),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
})

export const config = appConfig()
