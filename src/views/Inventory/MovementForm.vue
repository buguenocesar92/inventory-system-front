<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { updateStockMovement } from '@/services/InventoryMovementService';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue'; // Componente para los selects
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';
import GoBackButton from '@/components/GoBackButton.vue';
// Composable para locales y bodegas (para movimientos entry/exit y para la sección de origen en transfer)
import { useLocationWarehouseSelect } from '@/composables/useLocationWarehouseSelect';
// Importamos el composable creado para la sección de destino en transfer
import { useTransferDestinationSelect } from '@/composables/useTransferDestinationSelect';

// Definir un tipo extendido para el payload
type StockMovementPayload = InventoryMovementPayload & {
  // Para entry y exit
  location_id?: number;
  origin_warehouse_id?: number;
  destination_warehouse_id?: number;
  // Para transfer
  origin_location_id?: number;
  destination_location_id?: number;
};

// 1. Obtener parámetros de ruta y definir el tipo de movimiento
const route = useRoute();
const productId = Number(route.params.id);
const movementType = (route.params.movementType as 'entry' | 'exit' | 'transfer') || 'entry';

// 2. Estado del formulario
const form = ref<InventoryMovementPayload>({
  product_id: productId,
  movement_type: movementType,
  quantity: 0,
  description: '',
});

// 3. Usar el composable global para locales y bodegas (y para la sección de origen en transfer)
const {
  locationWarehouseStore,
  locations,
  selectedLocation,
  selectedWarehouse,
  handleLocationChange,
  handleWarehouseChange,
} = useLocationWarehouseSelect();

const isLoading = ref(false);

// 4. Usar el composable para la sección de destino en transfer
const {
  selectedDestinationLocation,
  destinationWarehouseList,
  selectedDestinationWarehouse,
} = useTransferDestinationSelect();

// 5. Composables para validación y notificación
const { errors, errorMessage, handleValidationError } = useFormValidation();
const { showSuccessNotification } = useNotification();

// 6. Función para enviar el formulario
async function handleUpdateStock(): Promise<void> {
  isLoading.value = true;
  try {
    const payload: StockMovementPayload = {
      ...form.value,
      product_id: productId,
    };

    if (form.value.movement_type === 'entry') {
      payload.location_id = selectedLocation.value || undefined;
      payload.destination_warehouse_id = selectedWarehouse.value || undefined;
    } else if (form.value.movement_type === 'exit') {
      payload.location_id = selectedLocation.value || undefined;
      payload.origin_warehouse_id = selectedWarehouse.value || undefined;
    } else if (form.value.movement_type === 'transfer') {
      // Para transfer se usan:
      // - Los selects globales para origen
      payload.origin_location_id = selectedLocation.value || undefined;
      payload.origin_warehouse_id = selectedWarehouse.value || undefined;
      // - Los selects del composable para destino
      payload.destination_location_id = selectedDestinationLocation.value || undefined;
      payload.destination_warehouse_id = selectedDestinationWarehouse.value || undefined;
    }

    await updateStockMovement(payload);

    await showSuccessNotification(
      'Success!',
      `Stock updated successfully as ${form.value.movement_type.toUpperCase()}.`,
      '/list-product'
    );
  } catch (error) {
    handleValidationError(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Actualizar Stock</h1>
        <GoBackButton />
      </div>
      <!-- Contenedor del formulario -->
      <div class="flex justify-center items-center h-[calc(100vh-310px)]">
        <div class="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
          <form @submit.prevent="handleUpdateStock" class="space-y-6">
            <!-- Bloque condicional según el tipo de movimiento -->
            <div v-if="form.movement_type === 'transfer'">
              <!-- Sección de Origen: se usan los selects globales -->
              <FormSelect
                v-model="selectedLocation"
                id="origin_location_id"
                label="Seleccionar Local Origen"
                :options="locations"
                placeholder="Seleccione local origen"
                placeholderValue="0"
                required
                @change="handleLocationChange"
              />
              <FormSelect
                v-model="selectedWarehouse"
                id="origin_warehouse_id"
                label="Seleccionar Bodega Origen"
                :options="locationWarehouseStore.warehouseList"
                placeholder="Seleccione bodega de origen"
                placeholderValue="0"
                required
                @change="handleWarehouseChange"
              />
              <!-- Sección de Destino: se usan los selects del composable de destino -->
              <FormSelect
                v-model="selectedDestinationLocation"
                id="destination_location_id"
                label="Seleccionar Local Destino"
                :options="locations"
                placeholder="Seleccione local destino"
                placeholderValue="0"
                required
              />
              <FormSelect
                v-model="selectedDestinationWarehouse"
                id="destination_warehouse_id"
                label="Seleccionar Bodega Destino"
                :options="destinationWarehouseList"
                placeholder="Seleccione bodega de destino"
                placeholderValue="0"
                required
              />
            </div>
            <div v-else>
              <!-- Para entry y exit se usan los selects globales -->
              <FormSelect
                v-model="selectedLocation"
                id="location_id"
                label="Seleccionar Local"
                :options="locations"
                placeholder="Seleccione un local"
                placeholderValue="0"
                required
                @change="handleLocationChange"
              />
              <FormSelect
                v-model="selectedWarehouse"
                id="warehouse_id"
                :label="form.movement_type === 'entry' ? 'Seleccionar Bodega Destino' : 'Seleccionar Bodega Origen'"
                :options="locationWarehouseStore.warehouseList"
                :placeholder="form.movement_type === 'entry' ? 'Seleccione bodega destino' : 'Seleccione bodega origen'"
                placeholderValue="0"
                required
                @change="handleWarehouseChange"
              />
            </div>

            <!-- Campo oculto para movement_type -->
            <FormInput
              v-model="form.movement_type"
              id="movement_type"
              label="Movement Type"
              :error="errors.movement_type?.[0]"
              hidden
            />

            <!-- Campo Cantidad -->
            <FormInput
              v-model="form.quantity"
              id="quantity"
              label="Cantidad"
              :error="errors.quantity?.[0]"
              required
            />

            <!-- Campo Descripción -->
            <FormInput
              v-model="form.description"
              id="description"
              label="Descripción"
              :error="errors.description?.[0]"
            />

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-500 text-white font-medium py-3 text-lg rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {{ isLoading ? 'Actualizando...' : 'Actualizar Stock' }}
            </button>
          </form>

          <!-- Mensaje de error -->
          <p v-if="errorMessage" class="text-red-500 mt-2">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </AdminWrapper>
</template>
