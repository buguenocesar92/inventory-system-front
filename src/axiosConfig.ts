import axios from 'axios';
import router from './router';

// Obtiene el subdominio actual del host (si existe)
const getSubdomain = (): string | null => {
  const host = window.location.host; // Ejemplo: "tenant1.foo.localhost"
  const parts = host.split('.');

  if (parts.length > 2) {
    return parts[0]; // Retorna "tenant1"
  }

  return null; // No hay subdominio
};

// Configura la baseURL dinámicamente
const subdomain = getSubdomain();
const baseURL = subdomain
  ? `http://${subdomain}.api.localhost/api/` // Usa el subdominio dinámico
  : `http://api.localhost/api/`; // Usa la API por defecto

console.log(window.location.host);

// Crea una instancia de Axios
const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
});

// Variable para evitar múltiples solicitudes de refresh al mismo tiempo
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Manejo de cola para solicitudes fallidas
const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Interceptor de requests (para incluir el access_token)
axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuestas (para manejar errores globales y refresh token)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el servidor responde con 401 (token expirado) y no es un intento de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('Refresh token no disponible');
        }

        const response = await axios.post(`${baseURL}auth/refresh`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const { access_token, refresh_token } = response.data;

        console.log('Nuevo access token:', access_token);
        console.log('Nuevo refresh token:', refresh_token);

        // Almacena los nuevos tokens
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Actualiza las solicitudes en cola con el nuevo token
        processQueue(null, access_token);

        // Actualiza el header de la solicitud original
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
