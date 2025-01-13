<template>
  <a @click="handleLogout" href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Logout</span>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { logoutUser } from '@/services/AuthService';

export default defineComponent({
  name: 'LogoutButton',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
      try {
        // Llama al backend para cerrar sesión
        await logoutUser();

        // Limpia el estado del usuario en el store
        authStore.logout();

        // Redirige al usuario al login
        router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
        alert('Failed to log out. Please try again.');
      }
    };

    return { handleLogout };
  },
});
</script>
