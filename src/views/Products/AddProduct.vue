<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Add Product</h1>

      <form @submit.prevent="handleAddProduct" class="space-y-6">
        <!-- Campo Nombre del Producto -->
        <FormInput
          id="name"
          label="Product Name"
          v-model="form.name"
          :error="errors.name ? errors.name[0] : undefined"
          required
        />

        <!-- Campo Categoría -->
        <FormInput
          id="category"
          label="Category"
          v-model="form.category"
          :error="errors.category ? errors.category[0] : undefined"
          required
        />

        <!-- Campo Marca -->
        <FormInput
          id="brand"
          label="Brand"
          v-model="form.brand"
          :error="errors.brand ? errors.brand[0] : undefined"
        />

        <!-- Campo Código de Barras -->
        <FormInput
          id="barcode"
          label="Barcode"
          v-model="form.barcode"
          :error="errors.barcode ? errors.barcode[0] : undefined"
        />

        <!-- Campo Descripción -->
        <FormInput
          id="description"
          label="Description"
          v-model="form.description"
          :error="errors.description ? errors.description[0] : undefined"
          textarea
        />

        <!-- Campo URL de Imagen -->
        <FormInput
          id="image_url"
          label="Image URL"
          v-model="form.image_url"
          :error="errors.image_url ? errors.image_url[0] : undefined"
          type="url"
        />

        <!-- Campo Precio Unitario -->
        <FormInput
          id="unit_price"
          label="Unit Price"
          v-model="form.unit_price"
          :error="errors.unit_price ? errors.unit_price[0] : undefined"
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

<script lang="ts">
import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { addProduct } from '@/services/ProductService';
import FormInput from '@/components/FormInput.vue';
import Swal from 'sweetalert2';
import type { ProductPayload } from '@/types/ProductTypes';
import type { ValidationErrorResponse } from '@/types/ValidationErrorResponse';

export default {
  name: 'AddProduct',
  components: { FormInput },
  setup() {
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
    const errorMessage = ref<string | null>(null);
    const errors = ref<{ [key: string]: string[] }>({});

    const handleAddProduct = async () => {
      isLoading.value = true;
      errorMessage.value = null;
      errors.value = {};

      try {
        await addProduct(form.value);

        // Mostrar alerta de éxito con SweetAlert2
        await Swal.fire({
          title: 'Success!',
          text: 'The product has been added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        resetForm();
      } catch (error) {
        if (!axios.isAxiosError(error)) {
          errorMessage.value = 'An unexpected error occurred.';
          return;
        }

        const { response } = error as AxiosError<ValidationErrorResponse>;

        if (response?.status === 422) {
          errors.value = response.data.errors as { [key: string]: string[] };
          errorMessage.value = response.data.message || 'Validation error occurred.';
          return;
        }

        errorMessage.value = 'Unexpected error occurred. Please try again later.';
      } finally {
        isLoading.value = false;
      }
    };

    const resetForm = () => {
      form.value = {
        name: '',
        category: '',
        brand: '',
        barcode: '',
        description: '',
        image_url: '',
        unit_price: 0,
      };
    };

    return {
      form,
      isLoading,
      errorMessage,
      errors,
      handleAddProduct,
    };
  },
};
</script>
