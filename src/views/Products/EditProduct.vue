<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Edit Product</h1>

    <form @submit.prevent="handleEditProduct" class="space-y-6">
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

      <!-- Campo Stock Actual -->
      <FormInput
        id="current_stock"
        label="Current Stock"
        v-model="form.current_stock"
        :error="errors.current_stock ? errors.current_stock[0] : undefined"
        type="number"
        required
      />

      <!-- Campo Punto de Reorden -->
      <FormInput
        id="reorder_point"
        label="Reorder Point"
        v-model="form.reorder_point"
        :error="errors.reorder_point ? errors.reorder_point[0] : undefined"
        type="number"
        required
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
        {{ isLoading ? 'Updating...' : 'Update Product' }}
      </button>
    </form>

    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProduct, updateProduct } from '@/services/ProductService';
import FormInput from '@/components/FormInput.vue';
import type { ProductPayload } from '@/types/ProductTypes';
import type { ValidationErrorResponse } from '@/types/ValidationErrorResponse';

export default {
  name: 'EditProduct',
  components: { FormInput },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const productId = Number(route.params.id);
    const form = ref<ProductPayload>({
      name: '',
      category: '',
      brand: '',
      barcode: '',
      description: '',
      image_url: '',
      current_stock: 0,
      reorder_point: 0,
      unit_price: 0,
    });

    const isLoading = ref(false);
    const errorMessage = ref<string | null>(null);
    const errors = ref<{ [key: string]: string[] }>({});

    // Fetch the product data when the component is mounted
    const fetchProductData = async () => {
      try {
        isLoading.value = true;
        const product = await fetchProduct(productId);
        if (product) {
          form.value = product;
        } else {
          router.push('/404');
        }
      } catch (error) {
        errorMessage.value = 'Error loading product details.';
        console.error('Error fetching product:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleEditProduct = async () => {
      isLoading.value = true;
      errorMessage.value = null;
      errors.value = {};

      try {
        await updateProduct(productId, form.value);
        alert('Product updated successfully.');
        router.push('/list-product');
      } catch (error) {
        if (!axios.isAxiosError(error)) {
          errorMessage.value = 'An unexpected error occurred.';
          return;
        }

        const { response } = error as AxiosError<ValidationErrorResponse>;

        if (response?.status === 422) {
          // Manejar nuevos errores del backend
          errors.value = response.data.errors as { [key: string]: string[] };
          errorMessage.value = response.data.message || 'Validation error occurred.';
          return;
        }

        errorMessage.value = 'Unexpected error occurred. Please try again later.';
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchProductData);

    return {
      form,
      isLoading,
      errorMessage,
      errors,
      handleEditProduct,
    };
  },
};
</script>


<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
