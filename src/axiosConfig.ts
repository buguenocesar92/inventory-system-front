import axios from 'axios'
import router from './router'

// Crea una instancia de Axios
const axiosInstance = axios.create({
  baseURL: 'https://tu-api.com', // Cambia por tu URL base
  timeout: 5000,
})

// Interceptor de requests (para incluir el token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor de respuestas (para manejar errores globales)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde con 401, el token no es válido o ha expirado
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
