<!-- src/views/Sales/CashRegisterClose.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useCashRegister } from '@/composables/useCashRegister';
import AdminWrapper from '@/components/AdminWrapper.vue';

const closingAmount = ref(0);
const { isLoading, handleCloseCashRegister } = useCashRegister();

function closeRegister() {
  if (closingAmount.value > 0) {
    handleCloseCashRegister(closingAmount.value);
  } else {
    alert('El monto de cierre debe ser mayor a 0.');
  }
}
</script>

<template>
    <AdminWrapper>
      <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
          <h2 class="text-xl font-bold mb-4 text-center">Cierre de Caja</h2>
          <v-text-field
            v-model="closingAmount"
            label="Monto de Cierre"
            type="number"
            outlined
            dense
            class="mb-4"
          />
          <v-btn :disabled="isLoading" color="error" block @click="closeRegister">
            {{ isLoading ? 'Cerrando...' : 'Cerrar Caja' }}
          </v-btn>
        </div>
      </div>
    </AdminWrapper>
</template>
