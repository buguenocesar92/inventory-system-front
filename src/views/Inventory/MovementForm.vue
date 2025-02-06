<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { updateStockMovement } from '@/services/InventoryMovementService';
import FormInput from '@/components/FormInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';
import GoBackButton from '@/components/GoBackButton.vue';

// 1. Obtener parámetros de ruta
const route = useRoute();
const productId = Number(route.params.id);
const movementType = (route.params.movementType as 'entry' | 'exit' | 'adjustment') || 'entry';

// 2. Estado del formulario
const form = ref<InventoryMovementPayload>({
  product_id: productId,
  movement_type: movementType,
  quantity: 0,
  description: '',
  location_id: 0, // Campo obligatorio, siempre se enviará
});

const isLoading = ref(false);

// 3. Composables para validación y notificación
const { errors, errorMessage, handleValidationError } = useFormValidation();
const { showSuccessNotification } = useNotification();

// 4. Lógica para enviar el formulario
async function handleUpdateStock() {
  isLoading.value = true;
  try {
    await updateStockMovement(form.value);

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
        <div class="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md text-center">
          <form @submit.prevent="handleUpdateStock" class="space-y-6">
            <!-- Campo Movimiento (oculto si no quieres que el usuario lo cambie) -->
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

            <!-- Campo de Localización (Siempre Visible) -->
            <FormInput
              v-model="form.location_id"
              id="location_id"
              label="Sucursal"
              :error="errors.location_id?.[0]"
              required
            />

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-500 text-white font-medium py-3 text-lg rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {{ isLoading ? 'Actualizando...' : 'Actualizar Stock' }}
            </button>
          </form>

          <!-- Mensaje de error si lo hay -->
          <p v-if="errorMessage" class="text-red-500 mt-2">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </AdminWrapper>
</template>
