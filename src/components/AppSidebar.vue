<template>
  <aside
    role="navigation"
    aria-label="Sidebar"
    :class="[
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      !isAuthenticated ? 'xl:hidden' : '',
      'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700'
    ]"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <!-- Iteramos sobre los items filtrados -->
        <li
          v-for="(item, index) in displayedSidebarItems"
          :key="index"
        >
          <SidebarItem :item="item" />
        </li>

        <!-- Botón de Logout, solo si está autenticado -->
        <li v-if="isAuthenticated">
          <LogoutButton />
        </li>
      </ul>

      <!-- Botón para cerrar el sidebar -->
      <button
        @click="closeSidebar"
        class="absolute top-4 right-4 p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
        aria-label="Cerrar Sidebar"
      >
        Cerrar
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue';
import SidebarItem from '@/components/SidebarItem.vue';
import { useSidebarItems } from '@/composables/useSidebarItems';

// Props y eventos
defineProps(['isSidebarOpen']);
const emit = defineEmits(['closeSidebar']);

// Obtenemos los ítems y el estado "isAuthenticated" desde el composable
const { displayedSidebarItems, isAuthenticated } = useSidebarItems();

// Función para cerrar el sidebar
const closeSidebar = () => {
  emit('closeSidebar');
};
</script>
