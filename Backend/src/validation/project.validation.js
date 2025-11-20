import {z} from "zod"


export const projectIdSchema = z.string().trim().min(1, {message: "Project ID is required"})

export const createProjectSchema = z.object({
  emoji: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1, {message: "Name is required"}).max(225),
  description: z.string().trim().optional(),
})

export const updateProjectSchema = z.object({
  emoji: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1, {message: "Name is required"}).max(225),
  description: z.string().trim().optional(),
})


