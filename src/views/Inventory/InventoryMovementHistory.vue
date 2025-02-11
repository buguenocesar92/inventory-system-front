<!-- src/views/Inventory/InventoryMovementHistory.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProductMovements } from '@/services/InventoryMovementService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';
import GoBackButton from '@/components/GoBackButton.vue';

const route = useRoute();
const { showErrorNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

// Estado reactivo
const movements = ref<InventoryMovementPayload[]>([]);
const isLoading = ref(false);
const productId = ref(Number(route.params.productId));

// Configuración de la tabla
const headers = ref([
  { title: 'Fecha', value: 'created_at', sortable: true },
  { title: 'Producto', value: 'product.name', sortable: true },
  { title: 'Usuario', value: 'user.name', sortable: true },
  { title: 'Tipo de Movimiento', value: 'movement_type', sortable: true },
  { title: 'Cantidad', value: 'quantity', sortable: true },
  { title: 'Origen', value: 'origin_warehouse.name', sortable: true },
  { title: 'Destino', value: 'destination_warehouse.name', sortable: true },
  { title: 'Local', value: 'destination_warehouse.location.name', sortable: true }
]);


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

</script>
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Historial de Movimientos</h1>
        <GoBackButton />
      </div>

      <!-- Tabla de movimientos -->
      <v-data-table
        :headers="headers"
        :items="movements"
        :loading="isLoading"
        class="elevation-1 !shadow-lg !rounded-lg"
        :items-per-page="10"
      >
        <!-- Formato de fecha -->
        <template #item.created_at="{ item }">
          {{ new Date(item.created_at).toLocaleDateString() }}
        </template>

        <!-- Nombre del Producto -->
        <template #item.product.name="{ item }">
          {{ item.product?.name || 'N/A' }}
        </template>

        <!-- Usuario que realizó la acción -->
        <template #item.user.name="{ item }">
          {{ item.user?.name || 'N/A' }}
        </template>

        <!-- Tipo de movimiento con chip de color -->
        <template #item.movement_type="{ item }">
          <v-chip
            :color="item.movement_type === 'entry' ? 'green' :
                    item.movement_type === 'exit' ? 'red' : 'blue'"
            small
          >
            {{ item.movement_type === 'entry' ? 'Entrada' :
               item.movement_type === 'exit' ? 'Salida' : 'Transferencia' }}
          </v-chip>
        </template>

        <!-- Cantidad con signo -->
        <template #item.quantity="{ item }">
          <span
            :class="item.movement_type === 'entry' ? 'text-green-600' :
                    item.movement_type === 'exit' ? 'text-red-600' : 'text-blue-600'"
          >
            {{ item.movement_type === 'entry' ? '+' :
               item.movement_type === 'exit' ? '-' : '⇆' }}{{ item.quantity }}
          </span>
        </template>

        <!-- Origen del movimiento (Bodega) -->
        <template #item.origin_warehouse.name="{ item }">
          {{ item.origin_warehouse?.name || (item.movement_type === 'entry' ? 'N/A (Nuevo Stock)' : 'N/A') }}
        </template>

        <!-- Destino del movimiento (Bodega) -->
        <template #item.destination_warehouse.name="{ item }">
          {{ item.destination_warehouse?.name || 'N/A' }}
        </template>

        <!-- Local donde está la bodega destino -->
        <template #item.destination_warehouse.location.name="{ item }">
          {{ item.destination_warehouse?.location?.name || 'N/A' }}
        </template>

        <!-- Mensaje cuando no hay datos -->
        <template #no-data>
          <div class="text-center py-4 text-gray-500">
            No se encontraron movimientos
          </div>
        </template>
      </v-data-table>
    </div>
  </AdminWrapper>
</template>
