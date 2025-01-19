<template>
  <aside
    role="navigation"
    aria-label="Sidebar"
    :class="[
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      !isAuthenticated ? 'xl:hidden' : '',
      'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700'
    ]"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <!-- Iteramos sobre los items filtrados -->
        <li
          v-for="(item, index) in displayedSidebarItems"
          :key="index"
        >
          <SidebarItem :item="item" />
        </li>

        <!-- Botón de Logout, solo si está autenticado -->
        <li v-if="isAuthenticated">
          <LogoutButton />
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LogoutButton from '@/components/LogoutButton.vue';
import SidebarItem from '@/components/SidebarItem.vue';
import { useAuthStore } from '@/stores/authStore';
import { isSubdomain } from '@/utils/domainUtils';

// ==============================
// 1) Estado de Autenticación
// ==============================
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Para permisos
const hasPermission = (perm: string) => authStore.hasPermission(perm);

// ==============================
// 2) Estado de Sidebar (abierto/cerrado)
// ==============================
const isSidebarOpen = ref(false);

// Definimos el handler para el toggle
function toggleHandler() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

onMounted(() => {
  // Escuchamos un evento global para alternar el sidebar
  window.addEventListener('toggle-sidebar', toggleHandler);
});

onUnmounted(() => {
  // Importante: remover el listener al desmontar el componente
  window.removeEventListener('toggle-sidebar', toggleHandler);
});

// ==============================
// 3) Definir Items del Sidebar
// ==============================
const sidebarItems = [
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
    showCondition: () => isAuthenticated.value && hasPermission('products.index')
  },
  {
    label: 'POS venta',
    route: '/pos',
    icon: 'M4 6h16M4 12h16m-7 6h7',
    showCondition: () => isAuthenticated.value && hasPermission('sales.store')
  },
  {
    label: 'Roles and Permissions',
    route: '/roles-permissions',
    icon: 'M4 6h16M4 12h16m-7 6h7',
    showCondition: () =>
      isAuthenticated.value && hasPermission('roles.with-permissions')
  },
];

// ==============================
// 4) Filtrar Items (displayed)
// ==============================
const displayedSidebarItems = computed(() => {
  return sidebarItems.filter(item => {
    return item.showCondition ? item.showCondition() : true;
  });
});
</script>
