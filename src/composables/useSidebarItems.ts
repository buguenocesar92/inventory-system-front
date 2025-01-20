import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';
import type { Router, RouteRecordRaw } from 'vue-router';

export function useSidebarItems() {
  const authStore = useAuthStore();

  // Verificar si el usuario está autenticado
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  // Asegurar el tipado del router para que reconozca `getRoutes`
  const typedRouter = router as Router;

  // Función para verificar si el usuario tiene algún rol requerido
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => authStore.roles.includes(role));
  };

  // Función para verificar si el usuario tiene todos los permisos requeridos
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) =>
      authStore.permissions.includes(permission)
    );
  };

  // Generar dinámicamente los ítems del sidebar
  const displayedSidebarItems = computed(() => {
    return typedRouter
      .getRoutes() // Usamos el router tipado
      .filter((route: RouteRecordRaw) => {
        // Excluir rutas sin metadatos de sidebar
        if (!route.meta?.sidebar) {
          return false;
        }

        // Validar autenticación
        if (route.meta.requiresAuth && !isAuthenticated.value) {
          return false;
        }

        // Validar roles, si están definidos
        if (route.meta.roles && !hasAnyRole(route.meta.roles)) {
          return false;
        }

        // Validar permisos, si están definidos
        if (route.meta.permissions && !hasAllPermissions(route.meta.permissions)) {
          return false;
        }

        return true; // Mostrar la ruta si pasa las validaciones
      })
      .map((route: RouteRecordRaw) => ({
        label: route.meta?.label || '',
        route: route.path,
        icon: route.meta?.icon || '',
      }));
  });

  return {
    isAuthenticated,
    displayedSidebarItems,
  };
}
