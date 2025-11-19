import {RolePermissions} from "./role-permission.js"

export const roleGaurd = (role, requiredPermissions) => {
  const permissions = RolePermissions[role]

  const hasPermission = requiredPermissions.every(permission => permissions.includes(permission))

  if (!hasPermission) {
    throw new Error("You do not have permission to perform this action")
  }
}