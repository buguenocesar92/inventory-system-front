<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Product List</h1>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="isLoading"
      :search="search"
      item-value="id"
      @update:options="loadItems"
      class="elevation-1"
      dense
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
          @click="router.push({ name: 'MovementForm', params: { id: item.id, movementType: 'entry' } })"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <!-- Botón Quitar Stock -->
        <v-btn
          icon
          color="warning"
          @click="router.push({ name: 'MovementForm', params: { id: item.id, movementType: 'exit' } })"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchProducts, deleteProduct } from '@/services/ProductService';
import type { ProductPayload, FetchProductsResponse } from '@/types/ProductTypes';

export default {
  name: 'ProductListServer',
  setup() {
    const router = useRouter();
    const itemsPerPage = ref(5);
    const isLoading = ref(false);
    const serverItems = ref<ProductPayload[]>([]);
    const totalItems = ref(0); // Total de productos disponibles
    const search = ref('');

    const headers = ref([
      { text: 'Name', value: 'name' },
      { text: 'Category', value: 'category' },
      { text: 'Unit Price', value: 'unit_price' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]);

    // Cargar productos del servidor
    const loadItems = async ({
      page,
      itemsPerPage,
      sortBy,
    }: {
      page: number;
      itemsPerPage: number;
      sortBy: { key: string; order: string }[];
    }) => {
      isLoading.value = true;
      try {
        const { items, total }: FetchProductsResponse = await fetchProducts({
          page,
          itemsPerPage,
          sortBy,
          search: search.value,
        });
        serverItems.value = items;
        totalItems.value = total; // Asignar total de elementos
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Eliminar un producto
    const deleteProductHandler = async (id: number) => {
      try {
        await deleteProduct(id);
        serverItems.value = serverItems.value.filter((product) => product.id !== id);
        console.log(`Product with ID ${id} deleted.`);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };

    return {
      headers,
      serverItems,
      isLoading,
      totalItems, // Total asignado al prop items-length
      itemsPerPage,
      search,
      loadItems,
      deleteProduct: deleteProductHandler,
      router,
    };
  },
};
</script>


