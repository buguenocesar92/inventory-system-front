<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useEditProduct } from '@/composables/useEditProduct';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/CategorySelect.vue';
import AdminWrapper from '@/components/AdminWrapper.vue';
import GoBackButton from '@/components/GoBackButton.vue';

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
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado con botón de regreso -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Editar Producto</h1>
        <GoBackButton />
      </div>

      <div class="flex justify-center items-center h-[calc(100vh-250px)]">
        <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
          <form @submit.prevent="handleEditProduct" class="space-y-6">
            <!-- Nombre -->
            <FormInput
              id="name"
              label="Nombre del Producto"
              placeholder="Ingrese el nombre del producto"
              v-model="form.name"
              :error="errors.name?.[0]"
              required
            />

            <!-- Selector de Categorías -->
            <FormSelect
              v-model="form.category_id"
              id="category_id"
              label="Categoría"
              :options="categories"
              placeholder="Seleccione una categoría"
              placeholderValue="0"
              :error="errors.category_id?.[0]"
              required
            />

            <!-- Marca -->
            <FormInput
              id="brand"
              label="Marca"
              placeholder="Ingrese la marca del producto"
              v-model="form.brand"
              :error="errors.brand?.[0]"
            />

            <!-- Código de Barras -->
            <FormInput
              id="barcode"
              label="Código de Barras"
              placeholder="Ingrese el código de barras"
              v-model="form.barcode"
              :error="errors.barcode?.[0]"
            />

            <!-- Descripción -->
            <FormInput
              id="description"
              label="Descripción"
              placeholder="Ingrese una descripción del producto"
              v-model="form.description"
              :error="errors.description?.[0]"
              textarea
            />

            <!-- URL de Imagen -->
            <FormInput
              id="image_url"
              label="URL de la Imagen"
              placeholder="Ingrese la URL de la imagen"
              v-model="form.image_url"
              :error="errors.image_url?.[0]"
              type="url"
            />

            <!-- Precio Unitario -->
            <FormInput
              id="unit_price"
              label="Precio Unitario"
              placeholder="Ingrese el precio unitario"
              v-model="form.unit_price"
              :error="errors.unit_price?.[0]"
              type="number"
              required
            />

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-500 text-white font-medium py-3 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {{ isLoading ? 'Actualizando...' : 'Actualizar Producto' }}
            </button>
          </form>

          <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </AdminWrapper>
</template>
