import type { RegisterUser } from '@/types/UserTypes'
import axios from '@/axiosConfig'

export const registerUser = async (payload: RegisterUser): Promise<{ frontend_url: string }> => {
  const response = await axios.post('/auth/register', payload)
  return response.data
}
