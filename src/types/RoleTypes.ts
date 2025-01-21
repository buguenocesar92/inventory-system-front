/**
 * Representa un permiso.
 */
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Representa un usuario.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/**
 * Representa un rol,
 * que incluye permisos y usuarios asociados.
 */
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
  users: User[];
}

/**
 * Formularios de creación/edición (si los usas).
 */
export interface CreateRoleForm {
  name: string;
  // Otros campos que necesites para crear
}

export interface UpdateRoleForm {
  name: string;
  // Otros campos que necesites para actualizar
}
