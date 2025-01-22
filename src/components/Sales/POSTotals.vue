<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Props y eventos
defineProps({
  total: {
    type: Number,
    default: 0
  },
  isLoading: Boolean,
  hasItems: Boolean,
});

defineEmits(['confirm', 'clear']);
</script>

<template>
  <div class="w-1/4 bg-gray-200 p-4">
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Totales</h3>
      <p>Total: ${{ total.toFixed(2) }}</p>
    </div>
    <v-btn
      color="success"
      :disabled="!hasItems || isLoading"
      @click="$emit('confirm')"
    >
      Confirmar Venta
    </v-btn>
    <v-btn color="error" @click="$emit('clear')" class="mt-2">Cancelar Venta</v-btn>
  </div>
</template>
