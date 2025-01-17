<template>
  <!-- Navbar Component -->
  <Navbar />

  <!-- Sidebar Component -->
  <Sidebar />

  <!-- Main Content Area -->
  <div :class="['p-4 sm:ml-64', !isAuthenticated ? 'xl:ml-0' : '']">
    <div class="p-4 rounded-lg mt-14">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/AppNavbar.vue'; // Componente Navbar
import Sidebar from '@/components/AppSidebar.vue'; // Componente Sidebar
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Store de autenticación

// Auth Store
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Verificar autenticación al montar el componente principal
/* authStore.checkAuth(); */
</script>



<style scoped>
@media (min-width: 1281px) {
  #dropdown-user {
  top: 37px; right: -20px
}
}
@media (min-width: 320px) and (max-width: 480px) {

  #dropdown-user {
  top: 41px; right: -20px
}
}
</style>
