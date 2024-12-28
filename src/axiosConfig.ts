import axios from 'axios'
import router from './router'

// Crea una instancia de Axios
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth',
  timeout: 5000,
})

// Interceptor de requests (para incluir el access_token)
axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor de respuestas (para manejar errores globales)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde con 401, el access_token no es válido o ha expirado
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
