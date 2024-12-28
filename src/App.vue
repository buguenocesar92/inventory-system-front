<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

/** Variable reactiva para controlar el estado del menú en móvil */
const isMobileMenuOpen = ref(false)

/** Función para mostrar/ocultar el menú en móvil */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <header class="bg-gray-100 p-4 md:flex md:items-center md:justify-between">
      <!-- Logo e ícono de menú (en móvil) -->
      <div class="flex items-center justify-between">
        <!-- Sección izquierda (Logo + HelloWorld) -->
        <div class="flex items-center gap-4">
          <img alt="Vue logo" src="@/assets/logo.svg" class="w-16 h-16 md:w-20 md:h-20" />
          <HelloWorld msg="You did it!" />
        </div>

        <!-- Botón hamburguesa (solo se ve en móvil) -->
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
      <!-- En móvil se muestra u oculta según isMobileMenuOpen -->
      <!-- En pantallas md+ se muestra siempre -->
      <nav
        class="mt-4 md:mt-0 md:flex md:items-center"
        :class="isMobileMenuOpen ? 'block' : 'hidden md:block'"
      >
        <RouterLink
          to="/"
          class="block px-2 py-1 text-gray-700 hover:text-blue-600 transition-colors md:inline-block"
          active-class="text-blue-600 font-bold"
        >
          Home
        </RouterLink>
        <!-- Agrega más enlaces según tu app -->
      </nav>
    </header>

    <!-- Contenido principal -->
    <main class="container mx-auto mt-20 flex-1">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Sin estilos adicionales, todo se maneja con Tailwind. */
</style>
