<template>
<aside
  :class="[
    'bg-gray-800 text-white w-64 p-4 fixed inset-y-0 left-0 z-50 transform transition-transform',
    { '-translate-x-full': !isOpen, 'translate-x-0': isOpen }
  ]"
>

    <!-- Encabezado del sidebar (para móviles) -->
    <div v-if="isMobile" class="flex justify-between items-center mb-4">
      <h2 class="font-bold">Menu</h2>
      <button class="text-gray-400 hover:text-white" @click="closeSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Menú -->
    <nav>
      <NavMenu :items="items" :isAuthenticated="isAuthenticated" />
    </nav>
  </aside>

  <!-- Overlay para cerrar el sidebar en móvil -->
  <div
    v-if="isMobile && isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40"
    @click="closeSidebar"
  ></div>
</template>

<script setup lang="ts">
import NavMenu from './NavMenu.vue';
import { defineProps, defineEmits } from 'vue';

// Props del componente
const props = defineProps<{
  items: Array<{ label: string; to: string; icon: string }>;
  isAuthenticated: boolean;
  isOpen: boolean; // Indica si el sidebar móvil está abierto
  isMobile: boolean; // Indica si es un sidebar móvil o no
}>();

// Evento para cerrar el sidebar móvil
const emit = defineEmits(['close']);
const closeSidebar = () => emit('close');
</script>

<style scoped>
.translate-x-full {
  transform: translateX(100%);
}
.translate-x-0 {
  transform: translateX(0);
}
</style>
