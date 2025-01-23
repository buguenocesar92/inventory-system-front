<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormInput from '@/components/FormInput.vue';
import { fetchProduct, updateProduct } from '@/services/ProductService';
import { fetchCategories } from '@/services/CategoryService'; // Servicio para obtener categorías
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { ProductPayload } from '@/types/ProductTypes';
import type { CategoryPayload } from '@/types/CategoryTypes'; // Define el tipo para categorías

// Rutas
const route = useRoute();
const router = useRouter();
const productId = Number(route.params.id);

// Estado del formulario con valores por defecto
const form = ref<ProductPayload>({
  name: '',
  category_id: 0,
  brand: '',
  barcode: '',
  description: '',
  image_url: '',
  unit_price: 0,
});

// Estado para categorías disponibles
const categories = ref<CategoryPayload[]>([]);

// Loading y control de errores
const isLoading = ref(false);
const { errors, errorMessage, handleValidationError } = useFormValidation();
const { showSuccessNotification } = useNotification();

/**
 * Carga los datos de un producto al montar el componente.
 */
async function fetchProductData() {
  try {
    isLoading.value = true;
    const product = await fetchProduct(productId);
    if (product) {
      // Asignamos el producto a 'form' para editarlo
      form.value = product;
    } else {
      // Si no existe, redirige a 404
      router.push('/404');
    }
  } catch (error) {
    handleValidationError(error);
  } finally {
    isLoading.value = false;
  }
}

/**
 * Carga las categorías disponibles.
 */
async function fetchCategoriesData() {
  try {
    const fetchedCategories = await fetchCategories();
    categories.value = fetchedCategories;
    console.log('Categories loaded:', categories.value);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

/**
 * Envía la actualización del producto al backend.
 */
async function handleEditProduct() {
  isLoading.value = true;
  try {
    await updateProduct(productId, form.value);
    await showSuccessNotification('Success!', 'Product updated successfully.', '/list-product');
  } catch (error) {
    handleValidationError(error);
  } finally {
    isLoading.value = false;
  }
}

// Montar (cargar datos del producto y categorías)
onMounted(async () => {
  await fetchProductData();
  await fetchCategoriesData();
});

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
      <v-select
        v-model="form.category_id"
        :items="categories"
        item-title="name"
        item-value="id"
        label="Category"
        outlined
        dense
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
