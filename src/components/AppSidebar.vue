<template>
  <aside
    id="logo-sidebar"
    :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full', !isAuthenticated ? 'xl:hidden' : '', 'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700']"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <!-- Sidebar content -->
        <li v-if="isAuthenticated">
          <RouterLink to="/dashboard" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Dashboard</span>
          </RouterLink>
        </li>
        <li v-if="!isAuthenticated && isMainDomain">
          <RouterLink to="/register" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Register</span>
          </RouterLink>
        </li>
        <li v-if="!isAuthenticated && isSubdomain()">
          <RouterLink to="/login" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Login</span>
          </RouterLink>
        </li>
        <li v-if="isAuthenticated && hasPermission('products.index')">
          <RouterLink to="/list-product" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Inventory</span>
          </RouterLink>
        </li>
        <li v-if="isAuthenticated && hasPermission('sales.store')">
          <RouterLink to="/pos" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">POS venta</span>
          </RouterLink>
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
import { useAuthStore } from '@/stores/authStore';
import { isSubdomain } from '@/utils/domainUtils'; // Utilidad para lógica de dominio

const isMainDomain = ref(!isSubdomain());

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const hasPermission = (perm: string) => authStore.hasPermission(perm);

const isSidebarOpen = ref(false);
onMounted(() => {
  isMainDomain.value = !isSubdomain();
  window.addEventListener('toggle-sidebar', () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  });
});
</script>
