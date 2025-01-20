import type { RegisterUser } from '@/types/UserTypes'
import axios from '@/axiosConfig'

export const registerUser = async (payload: RegisterUser): Promise<{ frontend_url: string }> => {
  const response = await axios.post('/auth/register', payload)
  return response.data
}

export async function fetchAllUsers() {
  const response = await axios.get('/users');
  return response.data;
}

export const updateRoleUsers = async (
  roleId: string,
  userIds: number[]
): Promise<void> => {
  const response = await axios.put(`/roles/${roleId}/users`, { users: userIds });
  return response.data;
};
