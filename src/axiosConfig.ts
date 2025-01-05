import axios from 'axios'
import router from './router'

// Obtiene el subdominio actual del host (si existe)
const getSubdomain = () => {
  const host = window.location.host // Ejemplo: "tenant1.foo.localhost"
  const parts = host.split('.')

  // Si tiene más de dos partes, es un subdominio (por ejemplo, "tenant1.foo.localhost")
  if (parts.length > 2) {
    return parts[0] // Retorna "tenant1"
  }

  return null // No hay subdominio
}

// Configura la baseURL dinámicamente
const subdomain = getSubdomain()
const baseURL = subdomain
  ? `http://${subdomain}.api.localhost/api/` // Usa el subdominio dinámico
  : `http://api.localhost/api/` // Usa la API por defecto

console.log(window.location.host)
// Crea una instancia de Axios
const axiosInstance = axios.create({
  baseURL,
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
