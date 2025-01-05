import { isAxiosError } from 'axios'
import type { RegisterUser } from '@/types/UserTypes'
import axios from '@/axiosConfig'

/** Registrar un usuario */
export const registerUser = async (payload: RegisterUser): Promise<void> => {
  try {
    await axios.post('auth/register', payload)
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Error while registering user')
    } else {
      throw new Error('Error while registering user')
    }
  }
}
