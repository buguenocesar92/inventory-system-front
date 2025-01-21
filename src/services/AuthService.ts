// src/services/AuthService.ts
import axios from '@/axiosConfig';
import type { AuthPayload, LoginResponse } from '@/types/AuthTypes';

export const loginUser = async (payload: AuthPayload): Promise<LoginResponse> => {
  const response = await axios.post('/auth/login', payload);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await axios.post('/auth/logout');
};

export const fetchUserData = async (): Promise<{ roles: string[]; permissions: string[] }> => {
  const response = await axios.post('/auth/me');
  return {
    roles: response.data.roles || [],
    permissions: response.data.permissions || [],
  };
};
