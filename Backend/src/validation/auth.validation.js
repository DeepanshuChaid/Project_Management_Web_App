import { z } from "zod"

export const registerUserSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().trim().email("Invalid email address").min(1).max(224),
  password: z.string().min(6).max(255).trim(),
  
})

export const loginUserSchema = z.object({
  email: z.string().trim().email("Invalid email address").min(1).max(224),
  password: z.string().min(6).max(255).trim(),
})