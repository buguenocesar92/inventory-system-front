<!-- SidebarItem.vue -->
<template>
<RouterLink
  :to="item.route"
  class="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
  active-class="bg-gray-200 dark:bg-gray-700"
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

defineProps<{
  item: SidebarItem
}>();
</script>
