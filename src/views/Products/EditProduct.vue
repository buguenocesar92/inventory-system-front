<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useEditProduct } from '@/composables/useEditProduct';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/CategorySelect.vue';

const route = useRoute();
const productId = Number(route.params.id);

// Usamos el composable pasándole el productId
const {
  form,
  categories,
  isLoading,
  errors,
  errorMessage,
  handleEditProduct,
} = useEditProduct(productId);

</script>

<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Edit Product</h1>

    <form @submit.prevent="handleEditProduct" class="space-y-6">
      <!-- Nombre -->
      <FormInput
        id="name"
        label="Product Name"
        v-model="form.name"
        :error="errors.name?.[0]"
        required
      />

      <!-- Selector de Categorías -->
      <FormSelect
          v-model="form.category_id"
          id="category_id"
          label="Category"
          :options="categories"
          placeholder="Select a category"
          placeholderValue="0"
          :error="errors.category_id?.[0]"
          required
        />

      <!-- Marca -->
      <FormInput
        id="brand"
        label="Brand"
        v-model="form.brand"
        :error="errors.brand?.[0]"
      />

      <!-- Código de Barras -->
      <FormInput
        id="barcode"
        label="Barcode"
        v-model="form.barcode"
        :error="errors.barcode?.[0]"
      />

      <!-- Descripción -->
      <FormInput
        id="description"
        label="Description"
        v-model="form.description"
        :error="errors.description?.[0]"
        textarea
      />

      <!-- URL de Imagen -->
      <FormInput
        id="image_url"
        label="Image URL"
        v-model="form.image_url"
        :error="errors.image_url?.[0]"
        type="url"
      />

      <!-- Precio Unitario -->
      <FormInput
        id="unit_price"
        label="Unit Price"
        v-model="form.unit_price"
        :error="errors.unit_price?.[0]"
        type="number"
        required
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
