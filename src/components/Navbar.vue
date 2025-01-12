<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
    <div class="max-w-screen-xl flex items-center justify-between mx-auto p-4">
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

      <!-- Botón hamburguesa (para móviles) -->
      <button class="md:hidden text-gray-700 hover:text-blue-600" @click="toggleMobileSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Menú principal en versión desktop -->
      <div class="hidden md:block">
        <NavMenu :items="items" :isAuthenticated="isAuthenticated" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import NavMenu from './NavMenu.vue';
import { defineProps, defineEmits } from 'vue';

// Props
const props = defineProps<{
  items: Array<{ label: string; to: string; icon: string }>;
  isAuthenticated: boolean;
}>();

// Emite un evento para abrir el sidebar móvil
const emit = defineEmits(['open-mobile-sidebar']);
const toggleMobileSidebar = () => emit('open-mobile-sidebar');
</script>
