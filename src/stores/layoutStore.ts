import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useLayoutStore = defineStore('layout', () => {
  const isSidebarOpen = ref(false);

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const closeSidebar = () => {
    isSidebarOpen.value = false;
  };

  const openSidebar = () => {
    isSidebarOpen.value = true;
  };

  watch(isSidebarOpen, (newValue) => {
    localStorage.setItem('isSidebarOpen', newValue.toString());
  });

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
});
