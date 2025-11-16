import HTTPSTATUS from "../configs/http.config.js"
import { ZodError } from "zod"

const formatZodError = (res, error) => {
  const err = error?.issues?.map(err => ({
    field: err.path.join("."),
    message: err.message
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation Error",
    error: error || "Invalid request body"
  })
}

export default function  errorHandlerMiddleware(error, req, res, next) {
  console.error(`Error occured on ${req.path}: ${error}`)

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON payload passed. Please check your request body",
      error: error.message || "Request body Error"
    })
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: error.message || "Internal server error",
    error: error.message || "Unkown error occured"
  })
}



