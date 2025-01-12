<template>
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
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

/**
 * Prop para controlar la función toggleSidebar
 */
defineProps({
  toggleSidebar: {
    type: Function as PropType<() => void>,
    required: true
  }
});
</script>

<style scoped>
/* Estilo específico del navbar, si es necesario */
</style>
