<!-- src/views/Sales/CashRegisterOpen.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useCashRegister } from '@/composables/useCashRegister';
import AdminWrapper from '@/components/AdminWrapper.vue';

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
  <AdminWrapper>
    <div class="flex justify-center items-center h-[calc(100vh-190px)]">
      <div class="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Apertura de Caja</h2>

        <v-text-field
          v-model="openingAmount"
          label="Monto de Apertura"
          type="number"
          outlined
          dense
          class="mb-6 text-lg"
        />

        <v-btn
          :disabled="isLoading"
          color="success"
          class="w-full py-3 text-lg font-semibold rounded-lg transition-transform transform hover:scale-105"
          @click="openCashRegister"
        >
          {{ isLoading ? 'Abriendo...' : 'Abrir Caja' }}
        </v-btn>
      </div>
    </div>
  </AdminWrapper>
</template>
