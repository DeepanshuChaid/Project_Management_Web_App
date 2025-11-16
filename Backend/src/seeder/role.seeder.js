import { PrismaClient, Permissions } from "@prisma/client"
import { RolePermissions } from "../utils/role-permission.js"
import prisma from "../prisma.js"

const seedRoles = async () => {
  console.log("Seeding roles started...")

  try {
    await prisma.$transaction(async (tx) => {
      console.log("Clearing roles...")
      await tx.role.deleteMany({})

      for (const roleName of Object.keys(RolePermissions)) {
        const permissions = RolePermissions[roleName]

        const existingRole = await tx.role.findUnique({
          where: { name: roleName }
        })

        if (!existingRole) {
          const newRole = await tx.role.create({
            data: {
              name: roleName,
              permissions: { set: permissions.map(p => Permissions[p]).filter(Boolean) }
            }
          })
          console.log(`Role ${roleName} created with permissions: ${permissions.join(", ")}`)
        } else {
          console.log(`Role ${roleName} already exists`)
        }
      }
    })

    console.log("Roles seeded successfully ✅")

  } catch (error) {
    console.error("Error during seeding:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedRoles().catch((error) => {
  console.log("Error seeding roles: ", error)
})

