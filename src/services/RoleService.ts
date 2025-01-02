// src/services/RoleService.ts

import axios from '@/axiosConfig'
import type { Role, CreateRoleForm, UpdateRoleForm, User } from '@/types/RoleTypes'

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

export const createRole = async (form: CreateRoleForm): Promise<void> => {
  await axios.post('/roles-permissions/roles', form)
}

export const updateRole = async (roleId: number, form: UpdateRoleForm): Promise<void> => {
  await axios.put(`/roles-permissions/roles/${roleId}`, form)
}

export const fetchUsersByTenant = async (): Promise<User[]> => {
  const response = await axios.get('/users/list-users-by-tenant')
  return response.data.users
}
