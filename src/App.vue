<template>
<!--   <Navbar @toggleSidebar="toggleSidebar" />
  <Sidebar
    :isSidebarOpen="sidebarOpen"
    @closeSidebar="toggleSidebar"
  />
  <div :class="['p-4 sm:ml-64', !isAuthenticated ? 'xl:ml-0' : '']"> -->
    <RouterView/>
<!--   </div> -->
</template>

<script setup lang="ts">
/* import { ref, computed } from 'vue';
import Navbar from '@/components/AppNavbar.vue';
import Sidebar from '@/components/AppSidebar.vue';
import { useAuthStore } from '@/stores/authStore';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated); */
</script>
