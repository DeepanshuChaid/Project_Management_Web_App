import prisma from "../prisma"

export const getMemberRoleInWorkspace = async (userId, workspaceId) => {
  const workspace = await prisma.workspace.findUnique({
    where: {id: workspaceId},
  })

  if (!workspace) throw new Error("Workspace not found")

  const member = await prisma.member.findFirst({
    where: {
      userId,
      workspaceId
    },
    include: {
      role: true
    }
  })

  if (!member) throw new Error("Member not found")

  const roleName= member.role?.name

  return {role: roleName}
  
}