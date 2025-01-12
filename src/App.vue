<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue';
import { useAuthStore } from '@/stores/authStore';
import { ref, onMounted, computed } from 'vue';

/** Estado reactivo para controlar el menú móvil (navbar) */
const isMobileMenuOpen = ref(false);

/** Función para mostrar/ocultar el menú en móvil */
/* const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}; */

/** Estado reactivo para controlar el sidebar */
const isSidebarOpen = ref(false);

/** Función para mostrar/ocultar el sidebar */
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

/** Accede al store de autenticación */
const authStore = useAuthStore();

/** Computed para acceder al estado de autenticación */
const isAuthenticated = computed(() => authStore.isAuthenticated);

/** Detectar si estamos en un subdominio */
const isSubdomain = () => {
  const host = window.location.host; // Ejemplo: "tenant.foo.localhost"
  const parts = host.split('.');
  return parts.length > 2; // Más de dos partes indica un subdominio
};

/** Estado reactivo para el dominio principal */
const isMainDomain = ref(!isSubdomain());

/** Verificar el estado de autenticación y dominio al montar el componente */
onMounted(() => {
  isMainDomain.value = !isSubdomain();
  authStore.checkAuth();
});
</script>

<template>
  <div class="flex">
    <!-- Sidebar -->
    <aside v-if="isAuthenticated"
      class="hidden md:block w-64 bg-gray-800 text-white h-screen"
    >
      <div class="p-4">
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
      </div>
      <div class="border-t border-gray-700"></div>
      <nav class="mt-4">
        <ul>
          <li v-if="isAuthenticated">
            <RouterLink to="/add-product" class="flex items-center px-4 py-2 hover:bg-gray-700">
              <span class="mdi mdi-home-city mr-3"></span> Add Product
            </RouterLink>
          </li>
          <li v-if="isAuthenticated">
            <RouterLink to="/list-product" class="flex items-center px-4 py-2 hover:bg-gray-700">
              <span class="mdi mdi-account mr-3"></span> Products
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Navbar -->
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

          <!-- Botón hamburguesa -->
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

          <!-- Menú principal -->
          <div
            :class="{ hidden: !isMobileMenuOpen, block: isMobileMenuOpen }"
            class="hidden md:block md:w-auto"
          >
            <ul class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <li v-if="isAuthenticated">
                <RouterLink to="/add-product" class="hover:text-blue-600">
                  Add Product
                </RouterLink>
              </li>
              <li v-if="isAuthenticated">
                <RouterLink to="/list-product" class="hover:text-blue-600">
                  Products
                </RouterLink>
              </li>
              <li v-if="!isAuthenticated && isMainDomain">
                <RouterLink
                  to="/register"
                  class="hover:text-blue-600"
                >
                  Register
                </RouterLink>
              </li>
              <li v-if="!isAuthenticated && isSubdomain()">
                <RouterLink
                  to="/login"
                  class="hover:text-blue-600"
                >
                  Login
                </RouterLink>
              </li>
              <li v-if="isAuthenticated">
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Content -->
      <main class="p-4">
        <RouterView />
      </main>
    </div>

    <!-- Mobile Sidebar -->
    <div
      class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden"
      v-if="isSidebarOpen"
      @click="toggleSidebar"
    ></div>
    <aside
      class="fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-4 z-50 transform transition-transform"
      :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold">Menu</h2>
        <button
          class="text-gray-400 hover:text-white"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav>
        <ul>
          <li v-if="isAuthenticated">
            <RouterLink to="/add-product" class="flex items-center px-4 py-2 hover:bg-gray-700">
              <span class="mdi mdi-home-city mr-3"></span> Add Product
            </RouterLink>
          </li>
          <li v-if="isAuthenticated">
            <RouterLink to="/list-product" class="flex items-center px-4 py-2 hover:bg-gray-700">
              <span class="mdi mdi-account mr-3"></span> Products
            </RouterLink>
          </li>
          <li v-if="!isAuthenticated && isMainDomain">
            <RouterLink to="/register" class="flex items-center px-4 py-2 hover:bg-gray-700">
              <span class="mdi mdi-account mr-3"></span> Register
            </RouterLink>
          </li>
          <li v-if="!isAuthenticated && isSubdomain()">
            <RouterLink to="/login" class="flex items-center px-4 py-2 hover:bg-gray-700">
              <span class="mdi mdi-login mr-3"></span> Login
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

<style scoped>
/* Sidebar mobile transition */
.translate-x-full {
  transform: translateX(100%);
}
.translate-x-0 {
  transform: translateX(0);
}
</style>

