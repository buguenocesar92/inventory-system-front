// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { loginUser, logoutUser, fetchUserData } from '@/services/AuthService';
import type { AuthPayload } from '@/types/AuthTypes';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    accessToken: '',
    refreshToken: '',
    roles: [] as string[],
    permissions: [] as string[],
  }),

  getters: {
    /**
     * Verifica si el usuario tiene un permiso
     * Uso: authStore.hasPermission('products.store')
     */
    hasPermission: (state) => (permission: string) => {
      return state.permissions.includes(permission);
    },

    /**
     * Verifica si el usuario tiene un rol
     * Uso: authStore.hasRole('admin')
     */
    hasRole: (state) => (role: string) => {
      return state.roles.includes(role);
    },
  },

  actions: {
    /**
     * Verifica tokens en localStorage y actualiza el estado
     */
    checkAuth() {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      this.isAuthenticated = !!token && !!refreshToken;
      this.accessToken = token || '';
      this.refreshToken = refreshToken || '';
    },

    /**
     * Inicia sesión y almacena tokens, roles y permisos
     */
    async login(payload: AuthPayload) {
      try {
        // Llamada al servicio
        const { access_token, refresh_token } = await loginUser(payload);

        // Guardar en localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Actualizar state
        this.accessToken = access_token;
        this.refreshToken = refresh_token;
        this.isAuthenticated = true;

        // Obtener roles y permisos del backend
        const { roles, permissions } = await fetchUserData();
        this.roles = roles;
        this.permissions = permissions;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    /**
     * Cierra sesión
     */
    async logout() {
      try {
        await logoutUser();
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        // Limpiar localStorage y state
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.accessToken = '';
        this.refreshToken = '';
        this.roles = [];
        this.permissions = [];
        this.isAuthenticated = false;
      }
    },

    /**
     * Obtiene roles y permisos desde el backend
     */
    async fetchUserData() {
      try {
        const { roles, permissions } = await fetchUserData();
        this.roles = roles;
        this.permissions = permissions;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
  },
});
