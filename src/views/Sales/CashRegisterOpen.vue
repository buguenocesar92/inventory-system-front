<!-- src/views/Sales/CashRegisterOpen.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useCashRegister } from '@/composables/useCashRegister';

const openingAmount = ref(0);
const { isLoading, handleOpenCashRegister } = useCashRegister();

async function openCashRegister() {
  try {
    if (openingAmount.value <= 0) {
      alert('El monto de apertura debe ser mayor a 0.');
      return;
    }
    await handleOpenCashRegister(openingAmount.value);
  } catch (error) {
    console.error('Error al abrir la caja:', error);
  }
}
</script>

<template>
  <div class="p-4 bg-gray-100 flex flex-col items-center">
    <h2 class="text-xl font-bold mb-4">Apertura de Caja</h2>
    <v-text-field
      label="Monto de Apertura"
      v-model="openingAmount"
      type="number"
      outlined
      dense
      class="mb-4"
    />
    <v-btn :disabled="isLoading" color="success" @click="openCashRegister">
      {{ isLoading ? 'Abriendo...' : 'Abrir Caja' }}
    </v-btn>
  </div>
</template>
