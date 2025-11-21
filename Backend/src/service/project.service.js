import prisma from "../prisma.js";

export const createProjectService = async (userId, workspaceId, body) => {
  const project = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      emoji: body.emoji,
      createdBy: { connect: { id: userId } },
      workspace: { connect: { id: workspaceId } },
    },
  });

  if (!project)
    throw new Error("Failed to create project PLease check service function");

  return { project };
};

export const getAllProjectsInWorkspaceService = async (
  workspaceId,
  pageSize,
  pageNumber,
) => {
  const skip = (pageNumber - 1) * pageSize;
  const projects = await prisma.project.findMany({
    where: { workspaceId },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: true,
      workspace: true,
      tasks: true,
    },
  });

  const totalCount = await prisma.project.count({
    where: { workspaceId },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return { projects, totalPages, totalCount, skip };
};




export const getProjectByIdAndWorkspaceIdService = async (projectId, workspaceId) => {
  const project = await prisma.project.findUnique({
    where: {id: projectId, workspaceId},
  })

  if (!project) throw new Error("Project not found")

  return {project}
}
