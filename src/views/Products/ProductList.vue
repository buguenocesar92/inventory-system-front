<!-- eslint-disable vue/valid-v-slot -->
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
    <template v-slot:item.actions="{ item }">
        <!-- Botón Editar -->
        <v-btn
          icon
          color="primary"
          @click="router.push({ name: 'EditProduct', params: { id: item.id } })"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>


        <!-- Botón Eliminar -->
        <v-btn icon color="error" @click="deleteProduct(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>

        <!-- Botón Agregar Stock -->
        <v-btn
          icon
          color="success"
          @click="router.push({
            name: 'MovementForm',
            params: { id: item.id, movementType: 'entry' }
          })"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <!-- Botón Quitar Stock -->
        <v-btn
          icon
          color="warning"
          @click="router.push({
            name: 'MovementForm',
            params: { id: item.id, movementType: 'exit' }
          })"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'; // Importar useRouter
import { ref, onMounted } from 'vue'
import { fetchProducts, deleteProduct } from '@/services/ProductService'
import type { ProductPayload } from '@/types/ProductTypes'

export default {
  name: 'ProductList',
  setup() {
    const router = useRouter(); // Instancia de router
    const products = ref<ProductPayload[]>([])
    const isLoading = ref(false)

    const headers = ref([
      { title: 'Name', value: 'name'},
      { title: 'Category', value: 'category'},
      { title: 'Unit Price', value: 'unit_price'},
      { title: 'Actions', value: 'actions' },
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
      router
    }
  },
}
</script>
