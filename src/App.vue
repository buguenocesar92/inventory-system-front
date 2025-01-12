<template>
  <div class="flex">
    <!-- Sidebar (versión desktop) -->
    <aside
      v-if="isAuthenticated"
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
          <!-- Iteramos los links en lugar de duplicar -->
          <li v-for="item in navItems" :key="item.to">
            <RouterLink
              :to="item.to"
              class="flex items-center px-4 py-2 hover:bg-gray-700"
            >
              <span :class="['mdi', item.icon, 'mr-3']"></span>
              {{ item.label }}
            </RouterLink>
          </li>

          <!-- Botón de Logout sólo si está autenticado -->
          <li v-if="isAuthenticated">
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <div class="flex-1">
      <!-- Navbar (encabezado) -->
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

          <!-- Menú principal (desktop y mobile) -->
          <div
            :class="{ hidden: !isMobileMenuOpen, block: isMobileMenuOpen }"
            class="hidden md:block md:w-auto"
          >
            <ul class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <!-- Iteramos la lista de enlaces -->
              <li v-for="item in navItems" :key="item.to">
                <RouterLink :to="item.to" class="hover:text-blue-600">
                  {{ item.label }}
                </RouterLink>
              </li>

              <!-- Botón de Logout -->
              <li v-if="isAuthenticated">
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Contenido del router (vistas) -->
      <main class="p-4">
        <RouterView />
      </main>
    </div>

    <!-- Overlay oscuro (para cerrar sidebar móvil) -->
    <div
      class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden"
      v-if="isSidebarOpen"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar (versión móvil) -->
    <aside
      class="fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-4 z-50 transform transition-transform"
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
          <!-- Usamos los mismos enlaces en la versión móvil -->
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

          <!-- Botón de Logout en móvil -->
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
import { useAuthStore } from '@/stores/authStore';
import { ref, computed, onMounted } from 'vue';

/**
 * Estado y método para abrir/cerrar el menú móvil (navbar)
 */
const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

/**
 * Estado y método para abrir/cerrar el sidebar
 */
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

/**
 * Accedemos al store de autenticación
 */
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

/**
 * Detectar si estamos en un subdominio
 */
function isSubdomain() {
  const host = window.location.host; // p.ej: "tenant.foo.localhost"
  const parts = host.split('.');
  return parts.length > 2; // si hay más de 2 partes, es subdominio
}

/**
 * Verificar si es dominio principal
 */
const isMainDomain = ref(!isSubdomain());

/**
 * Al montar, checamos autenticación y dominio
 */
onMounted(() => {
  isMainDomain.value = !isSubdomain();
  authStore.checkAuth();
});

/**
 * Computed con la lista de enlaces
 * Se construye en base a isAuthenticated, isMainDomain, etc.
 */
const navItems = computed(() => {
  const items: Array<{ label: string; to: string; icon: string }> = [];

  // Si está autenticado
  if (isAuthenticated.value) {
    items.push(
      { label: 'Add Product', to: '/add-product', icon: 'mdi-home-city' },
      { label: 'Products', to: '/list-product', icon: 'mdi-account' }
    );
  }

  // Si NO está autenticado y es dominio principal => Register
  if (!isAuthenticated.value && isMainDomain.value) {
    items.push({
      label: 'Register',
      to: '/register',
      icon: 'mdi-account'
    });
  }

  // Si NO está autenticado y es subdominio => Login
  if (!isAuthenticated.value && isSubdomain()) {
    items.push({
      label: 'Login',
      to: '/login',
      icon: 'mdi-login'
    });
  }

  return items;
});
</script>

<style scoped>
/* Transiciones para sidebar móvil */
.translate-x-full {
  transform: translateX(100%);
}
.translate-x-0 {
  transform: translateX(0);
}
</style>
