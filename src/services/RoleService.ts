// src/services/RoleService.ts

import axios from '@/axiosConfig'
import type { Role } from '@/types/RoleTypes'

export const fetchRolesWithPermissions = async (): Promise<Role[]> => {
  const response = await axios.get('/roles-permissions/roles-with-permissions')
  return response.data
}

export const deleteRole = async (roleId: number): Promise<void> => {
  await axios.delete(`/roles-permissions/roles/${roleId}`)
}

export const removePermission = async (roleId: number, permission: string): Promise<void> => {
  await axios.delete(`/roles-permissions/roles/${roleId}/permissions`, {
    data: { permission },
  })
}

export const removeUserFromRole = async (roleId: number, userId: number): Promise<void> => {
  await axios.delete(`/roles-permissions/roles/${roleId}/users/${userId}`)
}
