import {z} from "zod"

export const nameScehma = z.string().min(3, {message: "Name must be at least 3 characters long"}).max(225).trim();

export const descriptionSchema = z.string().trim().optional();

export const createWorkspaceSchema = z.object({
  name: nameScehma,
  description: descriptionSchema,
})

export const updateWorkspaceSchema = z.object({
  name: nameScehma,
  description: descriptionSchema,
})