import { z } from "zod";

const titleSchema = z.string().min(3).max(255).trim();

const descriptionSchema = z.string().min(3).trim().optional();

export const assignedToSchema = z.string().min(1).trim().nullable().optional();

export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

const dueDateSchema = z.string().trim().optional().refine(
  (val) => !val || !isNaN(Date.parse(val)),
  {
    message: "Invalid date format. please provide a valid date",
  }
);

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