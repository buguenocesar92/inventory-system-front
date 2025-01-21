<template>
  <nav
    class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    role="navigation"
    aria-label="Barra de navegación principal"
  >
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <!-- Botón de Sidebar y Logo -->
        <div class="flex items-center justify-start rtl:justify-end">
          <button
            @click="toggleSidebar"
            type="button"
            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-label="Abrir menú lateral"
          >
            <span class="sr-only">Abrir menú lateral</span>
            <IconMenu />
          </button>
          <a href="#" class="flex ms-2 md:me-24">
            <img :src="logoSrc" :alt="logoAlt" class="h-8 me-3" />
            <span
              class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
            >
              {{ brandName }}
            </span>
          </a>
        </div>

        <!-- Menú de usuario -->
        <!-- <UserDropdown v-if="isLoggedIn" /> -->
        <UserDropdown />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
/* import { defineEmits, computed } from 'vue';
import { useAuthGuard } from '@/composables/useAuthGuard'; */
import UserDropdown from '@/components/UserDropdown.vue';
import IconMenu from '@/components/icons/IconMenu.vue'; // Ícono del menú hamburguesa

// Props para personalizar el logo y la marca
defineProps({
  logoSrc: {
    type: String,
    default: 'https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg',
  },
  logoAlt: {
    type: String,
    default: 'Flowbite Logo',
  },
  brandName: {
    type: String,
    default: 'Flowbite',
  },
});

// Define el evento que emite el componente
const emit = defineEmits(['toggleSidebar']);

// Emitir evento para abrir/cerrar el sidebar
const toggleSidebar = () => {
  emit('toggleSidebar');
};

// Lógica de autenticación
/* const { isAuthenticated } = useAuthGuard(); */
/* const isLoggedIn = computed(() => isAuthenticated()); */
</script>
