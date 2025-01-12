<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Agregar/Quitar Stock</h1>

    <form @submit.prevent="handleUpdateStock" class="space-y-6">
      <!-- Campo Nombre del Producto -->
      <FormInput
        id="movement_type"
        label="movement_type"
        v-model="form.movement_type"
        :error="errors.movement_type ? errors.movement_type[0] : undefined"
        required
        hidden
      />

      <!-- Campo Categoría -->
      <FormInput
        id="quantity"
        label="quantity"
        v-model="form.quantity"
        :error="errors.quantity ? errors.quantity[0] : undefined"
        required
      />

      <!-- Campo Marca -->
      <FormInput
        id="description"
        label="description"
        v-model="form.description"
        :error="errors.description ? errors.description[0] : undefined"
      />

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {{ isLoading ? 'Updating...' : 'Update Product' }}
      </button>
    </form>

    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios'
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { updateStockMovement } from '@/services/InventoryMovementService';
import FormInput from '@/components/FormInput.vue';
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes';
import type { ValidationErrorResponse } from '@/types/ValidationErrorResponse'

export default {
  name: 'MovementForm',
  components: { FormInput },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const productId = Number(route.params.id);
    const movementType = (route.params.movementType as 'entry' | 'exit' | 'adjustment') || 'entry';

    const form = ref<InventoryMovementPayload>({
      product_id: productId,
      movement_type: movementType,
      quantity: 0,
      description: '',
    });

    const isLoading = ref(false);
    const errorMessage = ref<string | null>(null);
    const errors = ref<{ [key: string]: string[] }>({});

    const handleUpdateStock = async () => {
      isLoading.value = true
      errorMessage.value = null
      errors.value = {}
      try {
        await updateStockMovement(form.value)
        alert('Product updated successfully.')
        router.push('/list-product')
      } catch (error) {
        if (!axios.isAxiosError(error)) {
          errorMessage.value = 'An unexpected error occurred.'
          return
        }

        const { response } = error as AxiosError<ValidationErrorResponse>

        if (response?.status === 422) {
          // Manejar nuevos errores del backend
          errors.value = response.data.errors as { [key: string]: string[] }
          errorMessage.value = response.data.message || 'Validation error occurred.'
          return
        }

        errorMessage.value = 'Unexpected error occurred. Please try again later.'
      } finally {
        isLoading.value = false
      }
    }

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
