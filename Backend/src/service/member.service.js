import prisma from "../prisma.js";

export const getMemberRoleInWorkspace = async (userId, workspaceId) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) throw new Error("Workspace not found");

  const member = await prisma.member.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
    include: {
      role: true,
    },
  });
  console.log(member);

  if (!member) throw new Error("Member not found");

  const roleName = member.role?.name;

  if (!roleName) throw new Error("Role not found");

  return { role: roleName };
};

export const joinWorkspaceByInviteService = async (userId, inviteCode) => {
  const workspace = await prisma.workspace.findUnique({
    where: { inviteCode },
  });
  if (!workspace) throw new Error("Workspace not found");

  // check if user is already a member
  const existingMember = await prisma.member.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: workspace.id,
      },
    },
  });

  if (existingMember)
    throw new Error("User is already a member of this workspace");

  const role = await prisma.role.findUnique({
    where: { name: "MEMBER" },
  });

  if (!role)
    throw new Error("Please fkin seed your fkin database with roles, BAKA!!");

  const newMember = await prisma.member.create({
    data: {
      user: { connect: { id: userId } },
      workspace: { connect: { id: workspace.id } },
      role: { connect: { id: role.id } },
    },
  });

  return { workspaceId: workspace.id, role: role.name };
};


