import axios from '@/axiosConfig'
import type { LoginPayload } from '@/types/AuthTypes'

/** Login */
export const loginUser = async (payload: LoginPayload): Promise<{ access_token: string }> => {
  const response = await axios.post('/auth/login', payload)
  return response.data
}

/** Logout */
export const logoutUser = async (): Promise<void> => {
  // Llamar al endpoint de logout de tu backend.
  // Los interceptores ya se encargan de enviar el token.
  await axios.post('/auth/logout')
}
