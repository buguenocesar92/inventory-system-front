<template>
  <!-- Contenedor principal -->
  <div class="flex flex-col items-center justify-center py-20">
    <!-- Tarjeta de formulario -->
    <div class="w-full max-w-lg bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register Inventory Movement</h1>
      <form @submit.prevent="handleMovement" class="space-y-6">
        <!-- Selección de Producto -->
        <div>
          <label for="product_id" class="block text-gray-700 font-medium mb-1">Product:</label>
          <select
            id="product_id"
            v-model="form.product_id"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Select a product</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>

        <!-- Tipo de Movimiento -->
        <div>
          <label for="movement_type" class="block text-gray-700 font-medium mb-1">Movement Type:</label>
          <select
            id="movement_type"
            v-model="form.movement_type"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Select movement type</option>
            <option value="entry">Entry</option>
            <option value="exit">Exit</option>
            <option value="adjustment">Adjustment</option>
          </select>
        </div>

        <!-- Cantidad -->
        <div>
          <label for="quantity" class="block text-gray-700 font-medium mb-1">Quantity:</label>
          <input
            id="quantity"
            type="number"
            v-model="form.quantity"
            required
            min="1"
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label for="description" class="block text-gray-700 font-medium mb-1">Description (optional):</label>
          <textarea
            id="description"
            v-model="form.description"
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Botón de Enviar -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Submit' }}
        </button>
      </form>

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
      <!-- Mensaje de éxito -->
      <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { fetchProducts, createInventoryMovement } from '@/services/InventoryService'
import type { InventoryMovementPayload } from '@/types/InventoryTypes'
import type { Product } from '@/types/ProductTypes'

export default {
  name: 'InventoryMovementForm',
  setup() {
    // Formulario
    const form = ref<InventoryMovementPayload>({
      product_id: '',
      movement_type: '',
      quantity: 0,
      description: '',
    })

    // Variables para el estado
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)
    const successMessage = ref<string | null>(null)

    // Lista de productos
    const products = ref<Product[]>([])

    // Cargar productos al montar el componente
    onMounted(async () => {
      try {
        const response = await fetchProducts()
        products.value = response.data
      } catch {
        errorMessage.value = 'Failed to load products'
      }
    })

    // Manejar el registro del movimiento
    const handleMovement = async () => {
      isLoading.value = true
      errorMessage.value = null
      successMessage.value = null

      try {
        await createInventoryMovement(form.value)
        successMessage.value = 'Movement registered successfully'
        form.value = {
          product_id: '',
          movement_type: '',
          quantity: 0,
          description: '',
        }
      } catch {
        errorMessage.value = 'Error al cargar roles y permisos.'
      }
    }

    return {
      form,
      products,
      isLoading,
      errorMessage,
      successMessage,
      handleMovement,
    }
  },
}
</script>
