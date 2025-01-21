<!-- src/views/Products/AddProduct.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import FormInput from '@/components/FormInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import { addProduct } from '@/services/ProductService';
import type { ProductPayload } from '@/types/ProductTypes';

const form = ref<ProductPayload>({
  name: '',
  category: '',
  brand: '',
  barcode: '',
  description: '',
  image_url: '',
  unit_price: 0,
});

const isLoading = ref(false);

// Composables para validación y notificaciones
const { errors, errorMessage, handleValidationError } = useFormValidation();
const { showSuccessNotification } = useNotification();

// Lógica para crear un producto
async function handleAddProduct() {
  isLoading.value = true;
  try {
    await addProduct(form.value);

    // Notificación de éxito y redirección
    await showSuccessNotification(
      'Success!',
      'Product added successfully.',
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
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Add Product</h1>

      <form @submit.prevent="handleAddProduct" class="space-y-6">
        <!-- Campo Nombre del Producto -->
        <FormInput
          v-model="form.name"
          id="name"
          label="Product Name"
          :error="errors.name?.[0]"
          required
        />

        <!-- Campo Categoría -->
        <FormInput
          v-model="form.category"
          id="category"
          label="Category"
          :error="errors.category?.[0]"
          required
        />

        <!-- Campo Marca -->
        <FormInput
          v-model="form.brand"
          id="brand"
          label="Brand"
          :error="errors.brand?.[0]"
        />

        <!-- Campo Código de Barras -->
        <FormInput
          v-model="form.barcode"
          id="barcode"
          label="Barcode"
          :error="errors.barcode?.[0]"
        />

        <!-- Campo Descripción -->
        <FormInput
          v-model="form.description"
          id="description"
          label="Description"
          :error="errors.description?.[0]"
          textarea
        />

        <!-- Campo URL de Imagen -->
        <FormInput
          v-model="form.image_url"
          id="image_url"
          label="Image URL"
          :error="errors.image_url?.[0]"
          type="url"
        />

        <!-- Campo Precio Unitario -->
        <FormInput
          v-model="form.unit_price"
          id="unit_price"
          label="Unit Price"
          :error="errors.unit_price?.[0]"
          type="number"
          required
        />

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Adding...' : 'Add Product' }}
        </button>
      </form>

      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>
