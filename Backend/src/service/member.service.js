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

  return { role: roleName };
};



