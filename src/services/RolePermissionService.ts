import axios from '@/axiosConfig';
import type { Role, Permission } from '@/types/RolePermissionTypes';

/**
 * Obtener todos los roles con sus permisos asociados.
 */
export const fetchRolesWithPermissions = async (): Promise<{
  roles: Role[];
  permissions: Permission[];
}> => {
  const { data } = await axios.get('/roles/with-permissions');
  return data;
};

/**
 * Obtener un rol específico con sus permisos.
 */
export const fetchRoleById = async (roleId: number | string): Promise<Role> => {
  const { data } = await axios.get(`/roles/with-permissions/${roleId}`);
  return data;
};

/**
 * Actualizar los permisos de un rol específico.
 */
export const updateRolePermissions = async (
  roleId: number | string,
  permissions: (number | string)[]
): Promise<Role> => {
  const { data } = await axios.put(`/roles/with-permissions/${roleId}`, {
    permissions,
  });
  return data.role;
};

/**
 * Obtener todos los permisos disponibles.
 */
export const fetchAllPermissions = async (): Promise<Permission[]> => {
  const { data } = await axios.get('/permissions');
  // Suponiendo que el backend devuelve directamente un array de permisos
  return data; // No intentes acceder a `data.permissions` porque es un array directamente
};
