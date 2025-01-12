<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <AppSidebar
      :isAuthenticated="isAuthenticated"
      :navItems="navItems"
      :isSidebarOpen="isSidebarOpen"
      :toggleSidebar="toggleSidebar"
    />

    <!-- Contenido principal con scroll -->
    <div class="flex-1 overflow-y-auto bg-gray-100">
      <!-- Navbar -->
      <AppNavbar :toggleSidebar="toggleSidebar" />

      <!-- Contenido del router (vistas) -->
      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppSidebar from '@/components/AppSidebar.vue';
import AppNavbar from '@/components/AppNavbar.vue'; // Importar el nuevo componente navbar
import { useAuthStore } from '@/stores/authStore';

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Store de autenticación
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Computed con la lista de enlaces
const navItems = computed(() => {
  const items: Array<{ label: string; to: string; icon: string }> = [];
  if (isAuthenticated.value) {
    items.push(
      { label: 'Add Product', to: '/add-product', icon: 'mdi-home-city' },
      { label: 'Products', to: '/list-product', icon: 'mdi-account' }
    );
  }
  return items;
});

onMounted(() => {
  authStore.checkAuth();
});
</script>

<style scoped>
/* Estilo general de la app, si es necesario */
</style>
