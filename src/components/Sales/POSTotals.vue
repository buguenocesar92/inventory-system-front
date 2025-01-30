<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router'; // Importa el router para la redirección
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

const router = useRouter(); // Instancia del router

// Función para redirigir al cierre de caja
function navigateToCloseRegister() {
  router.push({ name: 'CashRegisterClose' });
}
</script>

<template>
  <div class="md:w-1/4 bg-gray-200 p-6 rounded-lg shadow-md">
    <!-- Totales -->
    <div class="mb-4 text-center">
      <h3 class="text-xl font-semibold">Totales</h3>
      <p class="text-lg text-gray-700 font-medium">Total: ${{ total.toFixed(2) }}</p>
    </div>

    <!-- Botones -->
    <div class="flex flex-col gap-6">
      <v-btn
        color="success"
        class="w-full text-lg font-medium"
        :disabled="!hasItems || isLoading"
        @click="$emit('confirm')"
      >
        Confirmar Venta
      </v-btn>

      <v-btn
        color="error"
        class="w-full text-lg font-medium"
        @click="$emit('clear')"
      >
        Cancelar Venta
      </v-btn>

      <!-- Botón para Cerrar Caja -->
      <v-btn color="info" @click="navigateToCloseRegister">
        Cerrar Caja
      </v-btn>
    </div>
  </div>
</template>
