import axios from '@/axiosConfig';
import type { Role, Permission } from '@/types/RolePermissionTypes';

/**
 * Fetch all roles with their associated permissions.
 */
export const fetchRolesWithPermissions = async (): Promise<{
  roles: Role[];
  permissions: Permission[];
}> => {
  const { data } = await axios.get('/roles/with-permissions');
  return data;
};

/**
 * Save or update a role.
 */
export const saveRole = async (role: { name: string; permissions: number[] }): Promise<Role> => {
  if (role.id) {
    const { data } = await axios.put(`/roles/${role.id}`, role);
    return data;
  } else {
    const { data } = await axios.post('/roles', role);
    return data;
  }
};

/**
 * Delete a role by ID.
 */
export const deleteRoleById = async (roleId: number): Promise<void> => {
  await axios.delete(`/roles/${roleId}`);
};

/**
 * Update permissions of a role.
 */
export const updateRolePermissions = async (
  roleId: number,
  permissions: number[]
): Promise<Role> => {
  const { data } = await axios.put(`/roles/with-permissions/${roleId}`, { permissions });
  return data.role;
};
