<!-- src/views/Inventory/InventoryMovementHistory.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProductMovements } from '@/services/InventoryMovementService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes';

const route = useRoute();
const router = useRouter();
const { showErrorNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

// Estado reactivo
const movements = ref<InventoryMovementPayload[]>([]);
const isLoading = ref(false);
const productId = ref(Number(route.params.productId));

// Configuración de la tabla
const headers = [
  { title: 'Fecha', value: 'created_at', align: 'start' },
  { title: 'Tipo', value: 'movement_type', align: 'center' },
  { title: 'Cantidad', value: 'quantity', align: 'end' },
  { title: 'Descripción', value: 'description', align: 'start' },
];

// Cargar movimientos al montar el componente
onMounted(async () => {
  try {
    isLoading.value = true;
    movements.value = await fetchProductMovements(productId.value);
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  } finally {
    isLoading.value = false;
  }
});

// Función para volver a la lista de productos
function goBack() {
  router.push({ name: 'ProductList' });
}
</script>
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="container mx-auto p-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Historial de Movimientos</h1>
      <v-btn
        color="primary"
        @click="goBack"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Volver
      </v-btn>
    </div>

    <!-- Tabla de movimientos -->
    <v-data-table
      :headers="headers"
      :items="movements"
      :loading="isLoading"
      class="elevation-1"
      :items-per-page="10"
    >
      <!-- Formato de fecha -->
      <template #item.created_at="{ item }">
        {{ new Date(item.created_at).toLocaleDateString() }}
      </template>

      <!-- Tipo de movimiento con chip de color -->
      <template #item.movement_type="{ item }">
        <v-chip
          :color="item.movement_type === 'entry' ? 'green' : 'red'"
          small
        >
          {{ item.movement_type === 'entry' ? 'Entrada' : 'Salida' }}
        </v-chip>
      </template>

      <!-- Cantidad con signo -->
      <template #item.quantity="{ item }">
        <span :class="item.movement_type === 'entry' ? 'text-green-600' : 'text-red-600'">
          {{ item.movement_type === 'entry' ? '+' : '-' }}{{ item.quantity }}
        </span>
      </template>

      <!-- Mensaje cuando no hay datos -->
      <template #no-data>
        <div class="text-center py-4 text-gray-500">
          No se encontraron movimientos
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>
/* Estilos personalizados */
.container {
  max-width: 1200px;
}

.v-data-table {
  background-color: white;
  border-radius: 8px;
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}
</style>
