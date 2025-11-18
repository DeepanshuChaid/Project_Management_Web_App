import prisma from "../prisma.js"

export const getMemberRoleInWorkspace = async (userId, workspaceId) => {
  const workspace = await prisma.workspace.findUnique({
    where: {id: workspaceId},
  })

  if (!workspace) throw new Error("Workspace not found")

  const member = await prisma.member.findUnique({
    where: {
      userId_workspaceId: {
        userId: "a6de6b39-baf4-4bd9-a813-5d062e9e4149",
        workspaceId: "07b5f8bb-9c9a-44f3-8dcd-dc67648ac140"
      }
    },
    include: {
      role: true
    }
  })
  console.log(member)

  if (!member) throw new Error("Member not found")

  const roleName= member.role?.name

  return {role: roleName}
  
}

