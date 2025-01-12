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
      <!-- Navbar o encabezado -->
      <nav class="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 p-4">
        <div class="max-w-screen-xl flex items-center justify-between mx-auto">
          <!-- Logo -->
          <a href="#" class="flex items-center space-x-3">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              class="h-8"
              alt="Flowbite Logo"
            />
            <span class="text-2xl font-semibold whitespace-nowrap dark:text-white">
              Flowbite
            </span>
          </a>
                    <!-- Botón hamburguesa (para abrir sidebar en móvil) -->
                    <button
            class="md:hidden text-gray-700 hover:text-blue-600"
            @click="toggleSidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Contenido del router (vistas) -->
      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppSidebar from '@/components/AppSidebar.vue'; // Importar el componente sidebar
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
