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

        <!-- Campo Stock Actual -->
<!--         <FormInput
          id="current_stock"
          label="Current Stock"
          v-model="form.current_stock"
          :error="errors.current_stock ? errors.current_stock[0] : undefined"
          type="number"
          required
        /> -->

        <!-- Campo Punto de Reorden -->
<!--         <FormInput
          id="reorder_point"
          label="Reorder Point"
          v-model="form.reorder_point"
          :error="errors.reorder_point ? errors.reorder_point[0] : undefined"
          type="number"
          required
        /> -->

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

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Product Added</h2>
        <p class="mb-4">The product has been successfully added.</p>
        <button
          @click="handleCloseModal"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { addProduct } from '@/services/ProductService'
import FormInput from '@/components/FormInput.vue'
import type { ProductPayload } from '@/types/ProductTypes'
import type { ValidationErrorResponse } from '@/types/ValidationErrorResponse'

export default {
  name: 'AddProduct',
  components: { FormInput },
  setup() {
    const form = ref<ProductPayload>({
      name: '', // Valor predeterminado como string
      category: '',
      brand: '', // Ensure brand is always a string
      barcode: '',
      description: '',
      image_url: '',
/*       current_stock: 0, */
/*       reorder_point: 0, */
      unit_price: 0,
    })

    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)
    const errors = ref<{ [key: string]: string[] }>({})
    const showModal = ref(false)

    const handleAddProduct = async () => {
      isLoading.value = true
      errorMessage.value = null
      errors.value = {}

      try {
        await addProduct(form.value)
        showModal.value = true
      } catch (error) {
        if (!axios.isAxiosError(error)) {
          errorMessage.value = 'An unexpected error occurred.'
          return
        }

        const { response } = error as AxiosError<ValidationErrorResponse>

        if (response?.status === 422) {
          errors.value = response.data.errors as { [key: string]: string[] }
          errorMessage.value = response.data.message || 'Validation error occurred.'
          return
        }

        errorMessage.value = 'Unexpected error occurred. Please try again later.'
      } finally {
        isLoading.value = false
      }
    }

    const handleCloseModal = () => {
      showModal.value = false
      resetForm()
    }

    const resetForm = () => {
      form.value = {
        name: '',
        category: '',
        brand: '',
        barcode: '',
        description: '',
        image_url: '',
/*         current_stock: 0,
        reorder_point: 0, */
        unit_price: 0,
      }
    }

    return {
      form,
      isLoading,
      errorMessage,
      errors,
      showModal,
      handleAddProduct,
      handleCloseModal,
    }
  },
}
</script>
