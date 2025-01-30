<!-- src/views/Sales/CashRegisterClose.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useCashRegister } from '@/composables/useCashRegister';
import AdminWrapper from '@/components/AdminWrapper.vue';

const closingAmount = ref(0);
const { isLoading, handleCloseCashRegister } = useCashRegister();

async function closeRegister() {
  if (closingAmount.value > 0) {
    try {
      await handleCloseCashRegister(closingAmount.value);
      console.log('Caja cerrada correctamente.');
    } catch (error) {
      console.error('Error al cerrar la caja:', error);
    }
  } else {
    alert('El monto de cierre debe ser mayor a 0.');
  }
}
</script>

<template>
  <AdminWrapper>
    <div class="flex justify-center items-center h-[calc(100vh-190px)]">
      <div class="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Cierre de Caja</h2>

        <v-text-field
          v-model="closingAmount"
          label="Monto de Cierre"
          type="number"
          outlined
          dense
          class="mb-6 text-lg"
        />

        <v-btn
          :disabled="isLoading"
          color="error"
          class="w-full py-3 text-lg font-semibold rounded-lg transition-transform transform hover:scale-105"
          @click="closeRegister"
        >
          {{ isLoading ? 'Cerrando...' : 'Cerrar Caja' }}
        </v-btn>
      </div>
    </div>
  </AdminWrapper>
</template>

