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
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import LogoutButton from '@/components/LogoutButton.vue';
import SidebarItem from '@/components/SidebarItem.vue';

// Importamos el composable con la definición de ítems
import { useSidebarItems } from '@/composables/useSidebarItems';

// 1) Obtenemos los ítems y el estado "isAuthenticated" desde el composable
const { displayedSidebarItems, isAuthenticated } = useSidebarItems();

// 2) Estado para abrir/cerrar el sidebar (aún manejado por un evento global)
const isSidebarOpen = ref(false);

// Handler para alternar el sidebar
function toggleHandler() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

onMounted(() => {
  window.addEventListener('toggle-sidebar', toggleHandler);
});

onUnmounted(() => {
  window.removeEventListener('toggle-sidebar', toggleHandler);
});
</script>
