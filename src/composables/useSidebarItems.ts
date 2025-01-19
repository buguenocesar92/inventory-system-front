import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';
import type { Router, RouteRecordRaw } from 'vue-router';

export function useSidebarItems() {
  const authStore = useAuthStore();

  // Verificar si el usuario está autenticado
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  // Obtener las rutas del router
  const typedRouter = router as Router;

  // Generar dinámicamente los ítems del sidebar
  const items = computed(() => {
    return typedRouter
      .getRoutes()
      .filter((route: RouteRecordRaw) => {
        // Excluir rutas sin metadatos de sidebar
        if (!route.meta?.sidebar) {
          return false;
        }

        // Validar autenticación y permisos
        if (route.meta.requiresAuth && !isAuthenticated.value) {
          return false;
        }

        return true; // Mostrar la ruta si pasa las condiciones
      })
      .map((route: RouteRecordRaw) => ({
        label: route.meta?.label as string || '',
        route: route.path,
        icon: route.meta?.icon as string || '',
      }));
  });

  return {
    isAuthenticated,
    displayedSidebarItems: items,
  };
}
