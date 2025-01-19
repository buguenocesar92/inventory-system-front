<!-- SidebarItem.vue -->
<template>
  <RouterLink
    :to="item.route"
    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white
           hover:bg-gray-100 dark:hover:bg-gray-700 group"
  >
    <svg
      class="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        :d="item.icon"
      />
    </svg>
    <span class="ml-3">{{ item.label }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface SidebarItem {
  label: string;
  route: string;
  icon: string;
}

const props = defineProps<{
  item: SidebarItem
}>();
</script>
