<template>
  <aside
    :class="[
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      !isAuthenticated ? 'xl:hidden' : '',
      'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700'
    ]"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li
          v-for="(item, index) in displayedSidebarItems"
          :key="index"
        >
          <SidebarItem :item="item" />
        </li>

        <li v-if="isAuthenticated">
          <LogoutButton />
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import LogoutButton from '@/components/LogoutButton.vue';
import SidebarItem from '@/components/SidebarItem.vue';
import { useAuthStore } from '@/stores/authStore';
import { isSubdomain } from '@/utils/domainUtils';


const displayedSidebarItems = computed(() => {
  return sidebarItems.filter(item => {
    // si item.showCondition existe, la llamamos
    // y retornamos los que sean `true`
    return item.showCondition ? item.showCondition() : true;
  });
});


const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const hasPermission = (perm: string) => authStore.hasPermission(perm);

// Para el ejemplo:
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
    showCondition: () => isAuthenticated.value && hasPermission('roles.with-permissions')
  },
];

// Control del sidebar (abre/cierra con un evento)
const isSidebarOpen = ref(false);

onMounted(() => {
  window.addEventListener('toggle-sidebar', () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  });
});
</script>
