<template>
  <aside
    v-if="isAuthenticated"
    class="fixed inset-y-0 left-0 bg-gray-800 text-white w-64 z-50 h-screen transition-transform"
    :class="{
      'md:translate-x-0': true,
      '-translate-x-full': !isSidebarOpen,
      'translate-x-0': isSidebarOpen
    }"
  >
    <!-- Contenido del Sidebar -->
    <div class="p-4 flex flex-col h-full">
      <!-- Encabezado -->
      <div class="flex items-center space-x-3 mb-4">
        <img
          src="https://randomuser.me/api/portraits/women/81.jpg"
          alt="User avatar"
          class="w-10 h-10 rounded-full"
        />
        <div>
          <h2 class="font-bold">Jane Smith</h2>
          <p class="text-sm text-gray-400">Logged in</p>
        </div>
      </div>

      <!-- Separador -->
      <div class="border-t border-gray-700 my-4"></div>

      <!-- Lista de navegación -->
      <nav class="flex-1 overflow-y-auto">
        <ul>
          <li v-for="item in navItems" :key="item.to">
            <RouterLink
              :to="item.to"
              class="flex items-center px-4 py-2 hover:bg-gray-700"
            >
              <span :class="['mdi', item.icon, 'mr-3']"></span>
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Botón de logout -->
      <button
        class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// Props
import type { PropType } from 'vue';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

defineProps({
  isAuthenticated: { type: Boolean, required: true },
  navItems: { type: Array as PropType<NavItem[]>, required: true },
  isSidebarOpen: { type: Boolean, required: true },
  toggleSidebar: { type: Function, required: true },
});

const handleLogout = () => {
  console.log('Logout clicked');
};
</script>

<style scoped>
.translate-x-full {
  transform: translateX(100%);
}
.translate-x-0 {
  transform: translateX(0);
}
</style>
