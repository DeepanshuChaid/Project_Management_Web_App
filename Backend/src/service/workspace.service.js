import prisma from "../prisma.js";
import { generateInviteCode } from "../utils/uuid.js";

export const createWorkspaceService = async (userId, body) => {
  const { name, description } = body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workspaces: true },
  });

  if (!user) throw new Error("User not found");

  const ownerRole = await prisma.role.findUnique({
    where: { name: "OWNER" },
  });

  if (!ownerRole)
    throw new Error("Owner role not found. Please seed the database");

  const workspace = await prisma.workspace.create({
    data: {
      owner: { connect: { id: userId } },
      name: name || `${user.name}'s Workspace`,
      description: description || `Workspace created for ${user.name}`,
      inviteCode: generateInviteCode(),
    },
  });

  const member = await prisma.member.create({
    data: {
      user: { connect: { id: userId } },
      workspace: { connect: { id: workspace.id } },
      role: { connect: { id: ownerRole.id } },
      joinedAt: new Date(),
    },
  });

  return { workspace };
};

// ************************************* //
// get all workspaces user is a member of
// ************************************* //
export const getAllUserWorkspacesUserIsMemberService = async (userId) => {
  const memberships = await prisma.member.findMany({
    where: { userId },
    include: {
      workspace: true,
    },
  });

  const workspaces = memberships.map((membership) => membership.workspace);

  return { workspaces };
};

export const getWorkspaceByIdService = async (workspaceId) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: {
          user: true,
          role: true,
        },
      },
    },
  });

  if (!workspace) throw new Error("Workspace not found");

  return { workspace };
};

// ************************************* // GET MEMBERS OF A WORKSPACE
// ************************************* //
export const getWorkspaceMemberService = async (workspaceId) => {
  const members = await prisma.member.findMany({
    where: { workspaceId },
    include: {
      user: true,
      role: true,
    },
  });

  return { members };
};

// *************************************
// GET ANALYTICS OF A WORKSPACE
// ************************************* //
export const getWorkspaceAnalyticsService = async (workspaceId) => {
  const currentDate = new Date();

  const totalTasks = await prisma.task.count({
    where: { workspaceId },
  });

  const overdueTasks = await prisma.task.count({
    where: {
      workspaceId,
      dueDate: { lt: currentDate },
      status: { not: "DONE" },
    },
  });

  const completedTasks = await prisma.task.count({
    where: {
      workspaceId,
      status: "DONE",
    },
  });

  return { totalTasks, overdueTasks, completedTasks };
};


// ************************************* //
// CHANGE MEMBER ROLE IN A WORKSPACE
// ************************************* //
export const changeMemberRoleService = async (
  workspaceId,
  memberId,
  roleId,
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) throw new Error("Workspace not found");

  const role = await prisma.role.findUnique({
    where: { id: roleId },
  });
  if (!role) throw new Error("Role not found");

  const member = await prisma.member.update({
    where: { 
      userId_workspaceId: {
        userId: memberId,
        workspaceId
      }
    },
    data: {
      role: { connect: { id: roleId } },
    },
  });

  if (!member) throw new Error("Member not found");

  return { member };
};



//  ************************************* //
// UPDATE WORKSPACE BY ID
// ************************************* //
export const updateWorkspaceByIdService = async (workspaceId, name, description) => {
  const workspace = await prisma.workspace.update({
    where: {id: workspaceId},
    data: {name, description}
  })

  if (!workspace) throw new Error("Workspace not found check updateWorkspaceByIdService")

  return {workspace}
}


//  ************************************* //
// DELETE WORKSPACE BY ID
// ************************************* //
export const deleteWorkspaceByIdService = async (workspaceId, userId) => {
  const currentWorkspace = await prisma.workspace.delete({
    where: {id: workspaceId}
  })

  if (!currentWorkspace) throw new Error("Workspace not found check deleteWorkspaceByIdService")

  return {currentWorkspace}
}

