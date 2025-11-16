import prisma from "../prisma.js"

export const getCurrentUserService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    include: {workspaces: true}
  })

  if (!user) throw new Error("User not found")

  return {user}
}