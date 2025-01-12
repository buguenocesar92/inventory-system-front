<template>
  <ul>
    <!-- Itera los enlaces proporcionados como prop -->
    <li v-for="item in items" :key="item.to">
      <RouterLink :to="item.to" class="flex items-center px-4 py-2 hover:bg-gray-700">
        <span :class="['mdi', item.icon, 'mr-3']"></span>
        {{ item.label }}
      </RouterLink>
    </li>

    <!-- Botón de logout, si está autenticado -->
    <li v-if="isAuthenticated">
      <LogoutButton />
    </li>
  </ul>
</template>

<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue';
import { defineProps } from 'vue';

// Props del componente
const props = defineProps<{
  items: Array<{ label: string; to: string; icon: string }>;
  isAuthenticated: boolean;
}>();
</script>

<style scoped>
/* Estilos específicos para el menú si los necesitas */
</style>
