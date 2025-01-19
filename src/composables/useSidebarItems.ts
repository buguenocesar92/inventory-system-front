// composables/useSidebarItems.ts
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { isSubdomain } from '@/utils/domainUtils';

/**
 * Composable que encapsula la lógica de los items del sidebar:
 * - Permisos y autenticación
 * - Filtro para mostrar/ocultar
 */
export function useSidebarItems() {
  const authStore = useAuthStore();
  // Computed para saber si el usuario está autenticado
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  // Helper para verificar permisos
  const hasPermission = (perm: string) => authStore.hasPermission(perm);

  // Definición de todos los items
  const items = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'M4 6h16M4 12h16m-7 6h7',
      showCondition: () => isAuthenticated.value
    },
    {
      label: 'Register',
      route: '/register',
      icon: 'M4 6h16M4 12h16m-7 6h7',
      showCondition: () => !isAuthenticated.value && !isSubdomain()
    },
    {
      label: 'Login',
      route: '/login',
      icon: 'M4 6h16M4 12h16m-7 6h7',
      showCondition: () => !isAuthenticated.value && isSubdomain()
    },
    {
      label: 'Inventory',
      route: '/list-product',
      icon: 'M4 6h16M4 12h16m-7 6h7',
      showCondition: () =>
        isAuthenticated.value && hasPermission('products.index')
    },
    {
      label: 'POS venta',
      route: '/pos',
      icon: 'M4 6h16M4 12h16m-7 6h7',
      showCondition: () =>
        isAuthenticated.value && hasPermission('sales.store')
    },
    {
      label: 'Roles and Permissions',
      route: '/roles-permissions',
      icon: 'M4 6h16M4 12h16m-7 6h7',
      showCondition: () =>
        isAuthenticated.value && hasPermission('roles.with-permissions')
    },
  ];

  // Filtrar ítems según showCondition
  const displayedSidebarItems = computed(() => {
    return items.filter(item =>
      item.showCondition ? item.showCondition() : true
    );
  });

  return {
    isAuthenticated,
    displayedSidebarItems,
  };
}
