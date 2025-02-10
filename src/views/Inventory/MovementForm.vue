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
// Importamos el composable para locales y bodegas
import { useLocationWarehouseSelect } from '@/composables/useLocationWarehouseSelect';

// 1. Obtener parámetros de ruta
const route = useRoute();
const productId = Number(route.params.id);
const movementType = (route.params.movementType as 'entry' | 'exit' | 'adjustment') || 'entry';

// 2. Estado del formulario (según tu tipo, puedes agregarle location_id y warehouse_id en el envío)
const form = ref<InventoryMovementPayload>({
  product_id: productId,
  movement_type: movementType,
  quantity: 0,
  description: '',
});

// 3. Extraemos la lógica y los valores de locales y bodegas
const {
  locationWarehouseStore,
  locations,
  selectedLocation,
  selectedWarehouse,
  handleLocationChange,
  handleWarehouseChange,
} = useLocationWarehouseSelect();

const isLoading = ref(false);

// 4. Composables para validación y notificación
const { errors, errorMessage, handleValidationError } = useFormValidation();
const { showSuccessNotification } = useNotification();

// 5. Lógica para enviar el formulario, combinando el form con los selects
async function handleUpdateStock() {
  isLoading.value = true;
  try {
    // Creamos el payload inicial
    const payload: any = {
      ...form.value,
      location_id: selectedLocation.value, // Agregamos el local
    };

    // Validar y asignar el campo de bodega según el tipo de movimiento:
    if (form.value.movement_type === 'entry') {
      // Para entrada, el backend espera destination_warehouse_id
      payload.destination_warehouse_id = selectedWarehouse.value;
    } else if (form.value.movement_type === 'exit') {
      // Para salida, el backend espera origin_warehouse_id
      payload.origin_warehouse_id = selectedWarehouse.value;
    } else {
      // Para otros movimientos, se asigna warehouse_id
      payload.warehouse_id = selectedWarehouse.value;
    }

    await updateStockMovement(payload);

    // Mostrar notificación y redirigir
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
      <!-- Encabezado con botón de regreso -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Actualizar Stock</h1>
        <GoBackButton />
      </div>

      <!-- Contenedor del formulario -->
      <div class="flex justify-center items-center h-[calc(100vh-310px)]">
        <div class="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
          <form @submit.prevent="handleUpdateStock" class="space-y-6">
            <!-- Select de Locales -->
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

            <!-- Select de Bodegas -->
            <FormSelect
              v-model="selectedWarehouse"
              id="warehouse_id"
              label="Seleccionar Bodega"
              :options="locationWarehouseStore.warehouseList"
              placeholder="Seleccione una bodega"
              placeholderValue="0"
              required
              @change="handleWarehouseChange"
            />

            <!-- Campo Movimiento (oculto si no se quiere modificar) -->
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

          <!-- Mensaje de error, si lo hay -->
          <p v-if="errorMessage" class="text-red-500 mt-2">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </AdminWrapper>
</template>
