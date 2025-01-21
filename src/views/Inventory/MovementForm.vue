<!-- src/views/Inventory/MovementForm.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { updateStockMovement } from '@/services/InventoryMovementService';
import FormInput from '@/components/FormInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes';

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
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Agregar/Quitar Stock</h1>

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
        label="Quantity"
        :error="errors.quantity?.[0]"
        required
      />

      <!-- Campo Descripción -->
      <FormInput
        v-model="form.description"
        id="description"
        label="Description"
        :error="errors.description?.[0]"
      />

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {{ isLoading ? 'Updating...' : 'Update Stock' }}
      </button>
    </form>

    <!-- Mensaje de error si lo hay -->
    <p v-if="errorMessage" class="text-red-500 mt-2">
      {{ errorMessage }}
    </p>
  </div>
</template>
