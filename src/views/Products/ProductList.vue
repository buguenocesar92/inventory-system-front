<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Product List</h1>

    <v-data-table
      :headers="headers"
      :items="products"
      item-value="id"
      class="elevation-1"
      dense
      :loading="isLoading"
      loading-text="Loading products..."
    >
      <template #item.actions="{ item }">
        <v-btn
          icon
          color="primary"
          @click="$router.push({ name: 'EditProduct', params: { id: item.id } })"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="error" @click="deleteProduct(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
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

    const headers = ref([
  { text: 'Name', value: 'name', class: 'text-black' },
  { text: 'Category', value: 'category', class: 'text-black' },
  { text: 'Unit Price', value: 'unit_price', class: 'text-black' },
  { text: 'Actions', value: 'actions', class: 'text-black', sortable: false },
])


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
      headers,
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
