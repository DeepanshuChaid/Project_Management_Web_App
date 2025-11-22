import prisma from "../prisma.js"

export const createTaskService = async (userId, workspaceId, projectId, body) => {
    const { title, description, priority, status, assignedTo, dueDate } = body;

    // Check if assigned user is part of workspace
    if (assignedTo) {
      const isAssignedToMember = await prisma.member.findFirst({
        where: {
          userId: assignedTo,
          workspaceId: workspaceId
        }
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
          assignedTo: { connect: { id: assignedTo } }
        })
      }
    });

    if (!task) {
      throw new Error("Failed to create task. Please try again");
    }

    return { task };
  };
