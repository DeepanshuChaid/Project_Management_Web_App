import { z } from "zod";

const titleSchema = z.string().min(3).max(255).trim();

const descriptionSchema = z.string().min(3).trim().optional();

export const assignedToSchema = z.string().min(1).trim().nullable().optional();

export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

const dueDateSchema = z.string().trim().optional().refine(
  (val) => {
    return !val || !isNaN(Date.parse(val));
  }, 
  {
    message: "Invalid date format. Please use YYYY-MM-DD"
  }
)

export const taskIdSchema = z.string().trim().min(2);

export const statusSchema = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
]);

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});