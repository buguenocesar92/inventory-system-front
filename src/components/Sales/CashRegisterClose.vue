<script setup lang="ts">
import { ref } from 'vue';
import { useCashRegister } from '@/composables/useCashRegister';

const closingAmount = ref(0);
const { isLoading, handleCloseCashRegister } = useCashRegister();

function closeCashRegister() {
  if (closingAmount.value >= 0) {
    handleCloseCashRegister(closingAmount.value);
  } else {
    alert('El monto de cierre no puede ser negativo.');
  }
}
</script>

<template>
  <div class="p-4 bg-gray-100 flex flex-col items-center">
    <h2 class="text-xl font-bold mb-4">Cierre de Caja</h2>
    <v-text-field
      label="Monto de Cierre"
      v-model="closingAmount"
      type="number"
      outlined
      dense
      class="mb-4"
    />
    <v-btn :disabled="isLoading" color="error" @click="closeCashRegister">
      {{ isLoading ? 'Cerrando...' : 'Cerrar Caja' }}
    </v-btn>
  </div>
</template>
