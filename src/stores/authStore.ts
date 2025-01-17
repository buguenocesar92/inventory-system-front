import { defineStore } from 'pinia';
import axios from '@/axiosConfig';
import type { LoginPayload } from '@/types/AuthTypes';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    accessToken: '',
    refreshToken: '',
    roles: [] as string[],
    permissions: [] as string[],
  }),
  actions: {
    /** Verifica si el usuario está autenticado */
    checkAuth() {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      this.isAuthenticated = !!token && !!refreshToken;
      this.accessToken = token || '';
      this.refreshToken = refreshToken || '';

      // Cargar datos del usuario si está autenticado
  /*     if (this.isAuthenticated) { */
/*         this.fetchUserData().catch((error) => {
          console.error('Error fetching user data on auth check:', error);
        }); */
   /*    } */
    },

    /** Inicia sesión */
    async login(payload: LoginPayload) {
      const response = await axios.post('/auth/login', payload);
      const { access_token, refresh_token } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      this.accessToken = access_token;
      this.refreshToken = refresh_token;
      this.isAuthenticated = true;

      // Carga roles y permisos
      await this.fetchUserData();
    },
    /** Cierra sesión */
    async logout() {
      try {
        await axios.post('/auth/logout');
      } catch (error) {
        console.error('Logout failed:', error);
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.accessToken = '';
      this.refreshToken = '';
      this.roles = [];
      this.permissions = [];
      this.isAuthenticated = false;
    },
    /** Obtiene roles y permisos del usuario */
    async fetchUserData() {
      const response = await axios.post('/auth/me');
      this.roles = response.data.roles || [];
      this.permissions = response.data.permissions || [];
    },
    /** Verifica si el usuario tiene un permiso */
    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
    },
    /** Verifica si el usuario tiene un rol */
    hasRole(role: string): boolean {
      return this.roles.includes(role);
    },
  },
});
