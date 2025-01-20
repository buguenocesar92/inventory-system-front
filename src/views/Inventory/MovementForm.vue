<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Agregar/Quitar Stock</h1>

    <form @submit.prevent="handleUpdateStock" class="space-y-6">
      <!-- Campo Movimiento -->
      <FormInput
        id="movement_type"
        label="Movement Type"
        v-model="form.movement_type"
        :error="errors.movement_type ? errors.movement_type[0] : undefined"
        hidden
      />

      <!-- Campo Cantidad -->
      <FormInput
        id="quantity"
        label="Quantity"
        v-model="form.quantity"
        :error="errors.quantity ? errors.quantity[0] : undefined"
        required
      />

      <!-- Campo Descripción -->
      <FormInput
        id="description"
        label="Description"
        v-model="form.description"
        :error="errors.description ? errors.description[0] : undefined"
      />

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {{ isLoading ? 'Updating...' : 'Update Stock' }}
      </button>
    </form>

    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { updateStockMovement } from '@/services/InventoryMovementService';
import FormInput from '@/components/FormInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes';

export default {
  name: 'MovementForm',
  components: { FormInput },
  setup() {
    const route = useRoute();

    const productId = Number(route.params.id);
    const movementType = (route.params.movementType as 'entry' | 'exit' | 'adjustment') || 'entry';

    const form = ref<InventoryMovementPayload>({
      product_id: productId,
      movement_type: movementType,
      quantity: 0,
      description: '',
    });

    const isLoading = ref(false);

    const { errors, errorMessage, handleValidationError } = useFormValidation();
    const { showSuccessNotification } = useNotification();

    const handleUpdateStock = async () => {
      isLoading.value = true;
      try {
        await updateStockMovement(form.value);

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
    };

    return {
      form,
      isLoading,
      errorMessage,
      errors,
      handleUpdateStock,
    };
  },
};
</script>

