import prisma from "../prisma.js"

export const createWorkspaceService = async (userId, body) => {
  const {name, description} = body;

  const user = await prisma.user.findUnique({
    where: {id: userId},
    include: {workspaces: true}
  })

  if (!user) throw new Error("User not found")

  const ownerRole = await prisma.role.findOne({
    where: {name: "OWNER"}
  })

  if (!ownerRole) throw new Error("Owner role not found. Please seed the database")


  const workspace = await prisma.workspace.create({
    data: {
      owner: {connect: {id: userId}},
      name: name || `${user.name}'s Workspace`,
      description: description || `Workspace created for ${user.name}`,
    }
  })

  const member = await prisma.member.create({
    data: {
      user: {connect: {id: userId}},
      workspace: {connect: {id: workspace.id}},
      role: {connect: {id: ownerRole.id}},
      joinedAt: new Date()
    }
  })

  return {workspace}
  
}


// ************************************* //
// get all workspaces user is a member of
// ************************************* //
export const getAllUserWorkspacesUserIsMemberService = async (userId) => {
  const memberships = await prisma.member.findMany({
    where: {userId},
    include: {
      workspace: true
    }
  })

  const workspaces = memberships.map((membership) => {
    membership.workspaceId
  })

  return {workspaces}
  
}