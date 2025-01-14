// authStore.ts
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    accessToken: '',
    refreshToken: '', // Añadimos refreshToken al estado
  }),
  actions: {
    /** Verifica si el usuario está autenticado */
    checkAuth() {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token'); // Verifica también el refresh token

      // Autenticación válida solo si ambos tokens están presentes
      this.isAuthenticated = !!token && !!refreshToken;
      this.accessToken = token || '';
      this.refreshToken = refreshToken || '';
    },
    /** Inicia sesión y guarda los tokens */
    login(token: string, refresh_token: string) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', refresh_token);
      this.accessToken = token;
      this.refreshToken = refresh_token;
      this.isAuthenticated = true;
    },
    /** Cierra sesión */
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.accessToken = '';
      this.refreshToken = '';
      this.isAuthenticated = false;
    },
  },
});
