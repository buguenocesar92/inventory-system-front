<template>
  <div>
    <!-- Sidebar (versión desktop) -->
    <aside
      v-if="isAuthenticated"
      class="hidden md:block w-64 bg-gray-800 text-white h-screen"
    >
      <div class="p-4 flex flex-col h-full">
        <div class="flex items-center space-x-3">
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
        <div class="border-t border-gray-700 my-4"></div>
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
            <li v-if="isAuthenticated">
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Sidebar (versión móvil) -->
    <aside v-if="isAuthenticated"
      class="fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-4 z-50 transform transition-transform h-screen md:hidden"
      :class="{
        '-translate-x-full': !isSidebarOpen,
        'translate-x-0': isSidebarOpen
      }"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold">Menu</h2>
        <button class="text-gray-400 hover:text-white" @click="toggleSidebar">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav>
        <ul>
          <li v-for="item in navItems" :key="item.to">
            <RouterLink
              :to="item.to"
              class="flex items-center px-4 py-2 hover:bg-gray-700"
              @click="toggleSidebar"
            >
              <span :class="['mdi', item.icon, 'mr-3']"></span>
              {{ item.label }}
            </RouterLink>
          </li>
          <li v-if="isAuthenticated">
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue';
import type { PropType } from 'vue';

defineProps({
  isAuthenticated: {
    type: Boolean,
    required: true
  },
  navItems: {
    type: Array as PropType<Array<{ label: string; to: string; icon: string }>>,
    required: true
  },
  isSidebarOpen: {
    type: Boolean,
    required: true
  },
  toggleSidebar: {
    type: Function as PropType<() => void>,
    required: true
  }
});
</script>

<style scoped>
/* Estilos específicos del sidebar */
.translate-x-full {
  transform: translateX(100%);
}
.translate-x-0 {
  transform: translateX(0);
}
</style>
