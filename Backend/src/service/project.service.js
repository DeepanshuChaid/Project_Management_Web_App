import prisma from "../prisma.js"

export const createProjectService = async (userId, workspaceId, body) => {
  const project = prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      emoji: body.emoji,
      createdBy: {connect: {id: userId}},
      workspace: {connect: {id: workspaceId}}
    }
  })

  if (!project) throw new Error("Failed to create project PLease check service function")

  return {project}
  
}


