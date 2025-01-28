<script setup lang="ts">
import { useAddProduct } from '@/composables/useAddProduct';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/CategorySelect.vue';
import AdminWrapper from '@/components/AdminWrapper.vue';

const {
  form,
  categories,
  isLoading,
  errors,
  errorMessage,
  handleAddProduct,
} = useAddProduct();
</script>

<template>
  <AdminWrapper>
    <div class="flex flex-col items-center justify-center py-20">
      <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
        <h1 class="text-2xl font-bold mb-4 text-center">Add Product</h1>

        <form @submit.prevent="handleAddProduct" class="space-y-6">

          <!-- Nombre del Producto -->
          <FormInput
            v-model="form.name"
            id="name"
            label="Product Name"
            :error="errors.name?.[0]"
            required
          />

          <!-- Select de categorías usando el componente FormSelect -->
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
            v-model="form.brand"
            id="brand"
            label="Brand"
            :error="errors.brand?.[0]"
          />

          <!-- Código de Barras, etc. -->
          <FormInput
            v-model="form.barcode"
            id="barcode"
            label="Barcode"
            :error="errors.barcode?.[0]"
          />

          <!-- Descripción -->
          <FormInput
            v-model="form.description"
            id="description"
            label="Description"
            :error="errors.description?.[0]"
            textarea
          />

          <!-- URL de imagen -->
          <FormInput
            v-model="form.image_url"
            id="image_url"
            label="Image URL"
            :error="errors.image_url?.[0]"
            type="url"
          />

          <!-- Precio Unitario -->
          <FormInput
            v-model="form.unit_price"
            id="unit_price"
            label="Unit Price"
            :error="errors.unit_price?.[0]"
            type="number"
            required
          />

          <!-- Botón Submit -->
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
  </AdminWrapper>
</template>
