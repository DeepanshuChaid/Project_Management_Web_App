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
  const skip = (pageNumber - 1) / pageSize;
  if (skip < 0) skip === 0;
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

export const getProjectByIdAndWorkspaceIdService = async (
  projectId,
  workspaceId,
) => {
  const project = await prisma.project.findMany({
    where: { id: projectId, workspaceId },
  });

  if (!project) throw new Error("Project not found");

  return { project };
};



export const getProjectAnalyticsService = async (
  workspaceId,
  projectId
) => {
  // First, verify the project exists and belongs to workspace
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  });

  if (!project) {
    throw new Error(
      "Project not found or does not belong to this workspace"
    );
  }

  const currentDate = new Date();

  // Run all three counts in parallel using Promise.all
  const [totalTasks, overdueTasks, completedTasks] = await Promise.all([
    // Count all tasks in project
    prisma.task.count({
      where: {
        projectId: projectId,
      },
    }),

    // Count overdue tasks (past due date AND not done)
    prisma.task.count({
      where: {
        projectId: projectId,
        dueDate: {
          lt: currentDate,  // less than current date
        },
        status: {
          not: "DONE",
        },
      },
    }),

    // Count completed tasks
    prisma.task.count({
      where: {
        projectId: projectId,
        status: "DONE",
      },
    }),
  ]);

  return {
    analytics: {
      totalTasks,
      overdueTasks,
      completedTasks,
    },
  };
};



export const updateProjectByIdService = async (workspaceId, projectId, body) => {
  const {name, description, emoji} = body;

  const project = await prisma.project.update({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    }, 
    data: {
      name,
      description,  
      emoji
    }
  })

  return {project}
}



export const deleteProjectByIdService = async (workspaceId, projectId) => {
  const project = await prisma.project.delete({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    }
  })

  if (!project) throw new Error("Project not found")

  return {project}
}