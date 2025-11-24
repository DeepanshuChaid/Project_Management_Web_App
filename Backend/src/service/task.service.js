import prisma from "../prisma.js";

export const createTaskService = async (
  userId,
  workspaceId,
  projectId,
  body,
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  // ✅ Check if assigned user is part of workspace
  if (assignedTo) {
    const isAssignedToMember = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: assignedTo, // ✅ Fixed: check the assignedTo user
          workspaceId,
        },
      },
    });

    if (!isAssignedToMember) {
      throw new Error("Assigned user is not a member of this workspace");
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      status,
      dueDate,
      createdBy: { connect: { id: userId } },
      project: { connect: { id: projectId } },
      workspace: { connect: { id: workspaceId } },
      ...(assignedTo && {
        assignedTo: { connect: { id: assignedTo } },
      }),
    },
  });

  if (!task) {
    throw new Error("Failed to create task. Please try again");
  }

  return { task };
};

// ✅ Update with validation and unassignment support
export const updateTaskService = async (
  workspaceId,
  projectId,
  taskId,
  body,
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  // ✅ Validate assignedTo user if provided
  if (assignedTo) {
    const isAssignedToMember = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: assignedTo,
          workspaceId,
        },
      },
    });

    if (!isAssignedToMember) {
      throw new Error("Assigned user is not a member of this workspace");
    }
  }

  // ✅ Build update data conditionally
  const updateData = {
    title,
    description,
    priority,
    status,
    dueDate,
  };

  // ✅ Handle assignment/unassignment
  if (assignedTo) {
    updateData.assignedTo = { connect: { id: assignedTo } };
  } else if (assignedTo === null || assignedTo === "") {
    // ✅ Explicitly unassign if null or empty string
    updateData.assignedTo = { disconnect: true };
  }

  const task = await prisma.task.update({
    where: {
      id: taskId,
      projectId,
      workspaceId,
    },
    data: updateData,
  });

  if (!task) throw new Error("Failed to update task. Please try again");

  return { task };
};

// GET ALL TASK WITH FILTERATION SYSTEM FROM THE WORKSPACE
export const getAllTaskService = async (workspaceId, filter, pagination) => {
  const query = {
    workspaceId: workspaceId
  };

  if (filter.projectId) {
    query.projectId = filter.projectId;
  }

  if (filter.status && filter.status.length > 0) {
    query.status = { in: filter.status };
  }

  if (filter.priority && filter.priority.length > 0) {
    query.priority = { in: filter.priority };
  }

  if (filter.assignedTo && filter.assignedTo.length > 0) {
    query.assignedTo = { in: filter.assignedTo };
  }

  if (filter.keyword && filter.keyword.length > 0) {
    query.title = { contains: filter.keyword, mode: "insensitive" };
  }

  if (filter.dueDate) {
    query.dueDate = { equals: new Date(filter.dueDate) };
  }

  // PAGINATION
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, totalCount] = await Promise.all([
    prisma.task.findMany({
      where: query,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: true,
        assignedTo: true,
        project: true,
      },
    }),

    prisma.task.count({ where: query }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    tasks,
    pagination: {
      pageNumber,
      pageSize,
      totalCount,
      totalPages,
      skip,
    },
  };
};

//  ********************************** //
// GET TASK BY ID
// *********************************** //
export const getTaskByIdService = async (workspaceId, projectId, taskId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  })

  if (!project) throw new Error("Project not found")

  
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
      projectId,
      workspaceId,
    }, 
    include: {
      createdBy: true,
      assignedTo: true,
      project: true
    }
  })

  if (!task) throw new Error("Task not found")

  return {task}
}


//  ********************************** //
// DELETE TASK BY ID
// *********************************** //
export const deleteTaskService = async (workspaceId, projectId, taskId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  })

  if (!project) throw new Error("Project not found")

  const task = await prisma.task.delete({
    where: {
      id: taskId,
      projectId,
      workspaceId,
    },
  })

  if (!task) throw new Error("Task not found")

  return { task }
}
