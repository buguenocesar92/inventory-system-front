<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Product List</h1>

    <table class="table-auto w-full border-collapse border border-gray-400">
      <thead>
        <tr>
          <th class="border border-gray-300 px-4 py-2">Name</th>
          <th class="border border-gray-300 px-4 py-2">Category</th>
          <th class="border border-gray-300 px-4 py-2">Unit Price</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="border border-gray-300 px-4 py-2">{{ product.name }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ product.category }}</td>
          <td class="border border-gray-300 px-4 py-2">${{ product.unit_price }}</td>
          <td class="border border-gray-300 px-4 py-2 flex space-x-2">
            <RouterLink
              :to="{ name: 'EditProduct', params: { id: product.id } }"
              class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </RouterLink>
            <button
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              @click="product.id !== undefined && deleteProduct(product.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { fetchProducts, deleteProduct } from '@/services/ProductService'
import type { ProductPayload } from '@/types/ProductTypes'

export default {
  name: 'ProductList',
  setup() {
    const products = ref<ProductPayload[]>([])
    const isLoading = ref(false)

    const fetchProductList = async () => {
      try {
        isLoading.value = true
        products.value = await fetchProducts()
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        isLoading.value = false
      }
    }

    const deleteProductHandler = async (id: number) => {
      try {
        await deleteProduct(id)
        products.value = products.value.filter(product => product.id !== id)
        console.log(`Product with ID ${id} deleted.`)
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }

    onMounted(fetchProductList)

    return {
      products,
      isLoading,
      fetchProductList,
      deleteProduct: deleteProductHandler,
    }
  },
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
