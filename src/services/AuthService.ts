import axios from '@/axiosConfig'
import type { LoginPayload } from '@/types/AuthTypes'

export const loginUser = async (payload: LoginPayload): Promise<{ access_token: string, refresh_token: string}> => {
  const response = await axios.post('/auth/login', payload)
  return response.data
}
export const logoutUser = async (): Promise<void> => {
  await axios.post('/auth/logout')
}
