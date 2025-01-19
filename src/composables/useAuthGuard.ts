// src/composables/useAuthGuard.ts
import { useAuthStore } from '@/stores/authStore';

/**
 * Composable que centraliza la lógica de autenticación y permisos
 */
export function useAuthGuard() {
  const authStore = useAuthStore();

  // Saber si el usuario está autenticado
  function isAuthenticated() {
    return authStore.isAuthenticated;
  }

  // Verificar tokens/localStorage con checkAuth
  async function checkAuth() {
    try {
      await authStore.checkAuth();
    } catch {
      throw new Error('Error al verificar autenticación');
    }
  }

  // Cargar roles y permisos solo si faltan
  async function fetchUserDataIfNeeded() {
    if (!authStore.roles.length || !authStore.permissions.length) {
      await authStore.fetchUserData();
    }
  }

  // Verificar si tiene algún rol requerido
  function hasAnyRole(roles: string[]) {
    return roles.some(role => authStore.hasRole(role));
  }

  // Verificar si tiene todos los permisos requeridos
  function hasAllPermissions(permissions: string[]) {
    return permissions.every(perm => authStore.hasPermission(perm));
  }

  // Método opcional para logout
  function doLogout() {
    authStore.logout();
  }

  return {
    isAuthenticated,
    checkAuth,
    fetchUserDataIfNeeded,
    hasAnyRole,
    hasAllPermissions,
    doLogout,
  };
}
