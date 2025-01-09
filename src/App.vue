<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted, computed } from 'vue'

/** Estado reactivo para controlar el menú móvil */
const isMobileMenuOpen = ref(false)

/** Función para mostrar/ocultar el menú en móvil */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/** Accede al store de autenticación */
const authStore = useAuthStore()

/** Computed para acceder al estado de autenticación */
const isAuthenticated = computed(() => authStore.isAuthenticated)

/** Detectar si estamos en un subdominio */
const isSubdomain = () => {
  const host = window.location.host // Ejemplo: "tenant.foo.localhost"
  const parts = host.split('.')
  return parts.length > 2 // Más de dos partes indica un subdominio
}

/** Estado reactivo para el dominio principal */
const isMainDomain = ref(!isSubdomain())

/** Verificar el estado de autenticación y dominio al montar el componente */
onMounted(() => {
  isMainDomain.value = !isSubdomain()
  authStore.checkAuth()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <header class="bg-gray-100 p-4 md:flex md:items-center md:justify-between">
      <!-- Logo y botón hamburguesa -->
      <div class="flex items-center justify-between">
        <img alt="Vue logo" src="@/assets/logo.svg" class="w-16 h-16 md:w-20 md:h-20" />
        <!-- Botón hamburguesa (visible solo en móvil) -->
        <button
          class="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          @click="toggleMobileMenu"
        >
          <!-- Ícono hamburguesa (svg) -->
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <!-- Menú de navegación -->
      <nav
        :class="{
          hidden: !isMobileMenuOpen,
          block: isMobileMenuOpen,
          'md:flex md:items-center': true,
        }"
        class="mt-4 md:mt-0"
      >
        <!-- Enlaces condicionales -->
        <RouterLink v-if="isAuthenticated" to="/add-product" class="block px-2 py-1">
          Add Product
        </RouterLink>
        <RouterLink v-if="isAuthenticated" to="/list-product" class="block px-2 py-1">
          Products
        </RouterLink>
        <RouterLink v-if="!isAuthenticated && isMainDomain" to="/register" class="block px-2 py-1">
          Register
        </RouterLink>
        <RouterLink v-if="!isAuthenticated && isSubdomain()" to="/login" class="block px-2 py-1">
          Login
        </RouterLink>

        <!-- Botón para cerrar sesión -->
        <LogoutButton v-if="isAuthenticated" />
      </nav>
    </header>

    <!-- Contenido principal -->
    <main class="container mx-auto mt-20 flex-1">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Estilos opcionales para el diseño general */
</style>
