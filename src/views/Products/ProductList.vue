<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Product List</h1>

    <!-- Barra de búsqueda -->
    <v-text-field
      v-model="search"
      label="Search"
      class="mb-4"
      outlined
      dense
      @input="loadItems({ page: 1, itemsPerPage, sortBy: [] })"
    ></v-text-field>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="isLoading"
      item-value="id"
      @update:options="loadItems"
      class="elevation-1"
      dense
      loading-text="Loading products..."
    >
    <template v-slot:item.actions="{ item }">
      <!-- Botón Editar -->
      <v-btn
        color="primary"
        @click="router.push({ name: 'EditProduct', params: { id: item.id } })"
        class="ma-2"
      >
        <v-icon start>mdi-pencil</v-icon>
        Edit
      </v-btn>

      <!-- Botón Eliminar -->
      <v-btn
        color="error"
        :disabled="deletingProductId === item.id"
        @click="deleteProduct(item.id)"
        class="ma-2"
      >
        <v-icon start>
          <template v-if="deletingProductId === item.id">
            mdi-loading
          </template>
          <template v-else>
            mdi-delete
          </template>
        </v-icon>
        Delete
      </v-btn>

      <!-- Botón Agregar Stock -->
      <v-btn
        color="success"
        @click="router.push({ name: 'MovementForm', params: { id: item.id, movementType: 'entry' } })"
        class="ma-2"
      >
        <v-icon start>mdi-plus</v-icon>
        Add Stock
      </v-btn>

      <!-- Botón Quitar Stock -->
      <v-btn
        color="warning"
        @click="router.push({ name: 'MovementForm', params: { id: item.id, movementType: 'exit' } })"
        class="ma-2"
      >
        <v-icon start>mdi-minus</v-icon>
        Remove Stock
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
    const deletingProductId = ref<number | null>(null); // ID del producto en proceso de eliminación

    const headers = ref([
      { title: 'Name', value: 'name', sortable: true },
      { title: 'Category', value: 'category', sortable: true },
      { title: 'Unit Price', value: 'unit_price', sortable: true },
      { title: 'Actions', value: 'actions', sortable: false },
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
      deletingProductId.value = id; // Establecer el producto en proceso de eliminación
      try {
        await deleteProduct(id);
        serverItems.value = serverItems.value.filter((product) => product.id !== id);
        console.log(`Product with ID ${id} deleted.`);
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        deletingProductId.value = null; // Restablecer el estado después de eliminar
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
      deletingProductId,
      router,
    };
  },
};
</script>


