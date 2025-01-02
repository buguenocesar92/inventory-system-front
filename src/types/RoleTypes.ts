// src/types/RoleTypes.ts

export interface PermissionData {
  roleId: number
  permission: string
}

export interface UserData {
  roleId: number
  userId: number
}

export interface RoleData {
  roleId: number
}

export type DeleteType = 'permission' | 'user' | 'role'

export type ConfirmData = PermissionData | UserData | RoleData

export interface Role {
  id: number
  name: string
  permissions: string[]
  users: { id: number; name: string; email: string }[]
}
