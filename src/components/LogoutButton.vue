<template>
  <a
    @click.prevent="handleLogout"
    href="#"
    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
  >
    <svg
      class="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
    <span class="ms-3">Logout</span>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Importar el store de autenticación
import { useRouter } from 'vue-router'; // Para redireccionar

export default defineComponent({
  name: 'LogoutButton',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await authStore.logout(); // Usa la lógica centralizada en el store
        router.push('/login'); // Redirige al login después del logout
      } catch (error) {
        console.error('Error during logout:', error);
        alert('Failed to log out. Please try again.');
      }
    };

    return { handleLogout };
  },
});
</script>
