<template>
  <li>
    <RouterLink
      :to="to"
      class="flex items-center p-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      <svg v-if="icon" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path :d="icon" />
      </svg>
      <span class="ms-3">{{ label }}</span>
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  to: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>
