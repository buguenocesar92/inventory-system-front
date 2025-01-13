<template>
  <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <!-- Botón de Sidebar y Logo -->
        <div class="flex items-center justify-start rtl:justify-end">
          <button
            @click="toggleSidebar"
            aria-controls="logo-sidebar"
            type="button"
            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span class="sr-only">Open sidebar</span>
            <svg
              class="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
          <a href="https://flowbite.com" class="flex ms-2 md:me-24">
            <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 me-3" alt="FlowBite Logo" />
            <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Flowbite</span>
          </a>
        </div>
        <!-- Menú de usuario -->
        <div v-if="isAuthenticated" class="relative flex items-center">
          <div class="flex items-center ms-3">
            <div>
              <!-- Botón que controla el menú -->
              <button
                type="button"
                @click="toggleDropdown"
                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                :aria-expanded="isDropdownOpen"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="w-8 h-8 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="user photo"
                />
              </button>
            </div>
            <!-- Menú desplegable -->
            <div
              :class="[
                'absolute right-0 mt-2 z-50 w-48 bg-white divide-y divide-gray-100 rounded shadow-lg dark:bg-gray-700 dark:divide-gray-600',
                isDropdownOpen ? 'block' : 'hidden',
              ]"
              id="dropdown-user"
            >
              <div class="px-4 py-3" role="none">
                <p class="text-sm text-gray-900 dark:text-white" role="none">Neil Sims</p>
                <p
                  class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                  role="none"
                >
                  neil.sims@flowbite.com
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                  >
                    Earnings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <aside
    id="logo-sidebar"
    :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full', !isAuthenticated ? 'xl:hidden' : '', 'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700']"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <!-- Sidebar content -->
        <li v-if="isAuthenticated">
          <RouterLink to="/dashboard" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Dashboard</span>
          </RouterLink>
        </li>
        <li v-if="!isAuthenticated && isMainDomain">
          <RouterLink to="/register" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Register</span>
          </RouterLink>
        </li>
        <li v-if="!isAuthenticated && isSubdomain()">
          <RouterLink to="/login" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Login</span>
          </RouterLink>
        </li>
        <li v-if="isAuthenticated">
          <RouterLink to="/list-product" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">Inventory</span>
          </RouterLink>
        </li>
        <li v-if="isAuthenticated">
          <RouterLink to="/pos" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span class="ms-3">POS venta</span>
          </RouterLink>
        </li>
        <li v-if="isAuthenticated">
            <LogoutButton />
        </li>
      </ul>
    </div>
  </aside>

  <div :class="['p-4 sm:ml-64', !isAuthenticated ? 'xl:ml-0' : '']">
    <div class="p-4 rounded-lg mt-14">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { isSubdomain } from '@/utils/domainUtils'; // Utilidad para lógica de dominio

// Sidebar
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Dropdown
const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Auth Store
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Estado reactivo para el dominio principal
const isMainDomain = ref(!isSubdomain());

// Check auth status and domain on component mount
onMounted(() => {
  isMainDomain.value = !isSubdomain();
  authStore.checkAuth();
});
</script>


<style scoped>
@media (min-width: 1281px) {
  #dropdown-user {
  top: 37px; right: -20px
}
}
@media (min-width: 320px) and (max-width: 480px) {

  #dropdown-user {
  top: 41px; right: -20px
}
}
</style>
