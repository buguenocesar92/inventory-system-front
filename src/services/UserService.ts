// src/services/UserService.ts
import axios from '@/axiosConfig';
import type { RegisterUser, User } from '@/types/UserTypes';

/**
 * Registra un usuario enviando 'name', 'email' y 'password'.
 * Retorna un objeto con "frontend_url" (según tu backend).
 */
export async function registerUser(payload: RegisterUser): Promise<{ frontend_url: string }> {
  const response = await axios.post('/auth/register', payload);
  return response.data;
}

/**
 * Obtiene la lista de usuarios desde el backend.
 */
export async function fetchAllUsers(): Promise<User[]> {
  const response = await axios.get('/users');
  return response.data;
}

/**
 * Eliminar usuario.
 */
export async function deleteUser(id: number): Promise<void> {
  await axios.delete(`/users/${id}`);
}

/**
 * Actualiza la asociación de usuarios a un rol determinado.
 * @param roleId  El ID (o string) del rol
 * @param userIds Array de IDs de usuarios que se van a asociar a ese rol
 */
export async function updateRoleUsers(roleId: string, userIds: number[]): Promise<void> {
  await axios.put(`/roles/${roleId}/users`, { users: userIds });
}
