<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Product List</h1>

    <RouterLink to="/add-product" class="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-5">
      <span>Crear Producto</span>
    </RouterLink>
    <!-- Barra de búsqueda -->
    <v-text-field
      v-model="search"
      label="Search"
      class="mb-4 mt-4"
      outlined
      dense
      @input="onSearchInput"
    ></v-text-field>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="isLoading"
      item-value="id"
      @update:options="loadItems"
      class="elevation-1 container-fill2"
      dense
      loading-text="Loading products..."
    >
      <!-- Columna de acciones -->
      <template v-slot:item.actions="{ item }">
        <!-- Botón Editar -->
        <v-btn
          color="primary"
          @click="router.push({ name: 'EditProduct', params: { id: item.id } })"
          class="ma-2 mr-2"
        >
          <v-icon start>mdi-pencil</v-icon>
          Edit
        </v-btn>

        <!-- Botón Eliminar -->
        <v-btn
          color="error"
          :disabled="deletingProductId === item.id"
          @click="deleteProduct(item.id)"
          class="ma-2 mr-2"
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
          class="ma-2 mr-2"
        >
          <v-icon start>mdi-plus</v-icon>
          Add Stock
        </v-btn>

        <!-- Botón Quitar Stock -->
        <v-btn
          color="warning"
          @click="router.push({ name: 'MovementForm', params: { id: item.id, movementType: 'exit' } })"
          class="ma-2 mr-2"
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
import { debounce } from '@/utils/debounce';

export default {
  name: 'ProductListServer',
  setup() {
    const router = useRouter();
    const itemsPerPage = ref(5);
    const isLoading = ref(false);
    const serverItems = ref<ProductPayload[]>([]); // Los productos del servidor
    const totalItems = ref(0); // Total de productos disponibles
    const search = ref('');
    const deletingProductId = ref<number | null>(null); // ID del producto en proceso de eliminación

    // Definición de los encabezados de la tabla
    const headers = ref([
      { title: 'Name', value: 'name', sortable: true },
      { title: 'Category', value: 'category', sortable: true },
      { title: 'Unit Price', value: 'unit_price', sortable: true },
      { title: 'Current Stock', value: 'current_stock', sortable: true }, // Nueva columna
      { title: 'Actions', value: 'actions', sortable: false },
    ]);

    // Cargar productos del servidor
    const loadItems = async (params: {
      page: number;
      itemsPerPage: number;
      sortBy: { key: string; order: string }[];
    }) => {
      isLoading.value = true;
      try {
        const { items, total }: FetchProductsResponse = await fetchProducts({
          page: params.page,
          itemsPerPage: params.itemsPerPage,
          sortBy: params.sortBy,
          search: search.value,
        });
        serverItems.value = items;
        totalItems.value = total; // Asignar total de elementos
      } catch (error) {
        console.error('Error fetching products:', error);

        // Verificar si la API devuelve un error de permisos
        if ((error as { response?: { status: number } }).response?.status === 403) {
          router.push('/403');
        }
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

    // Debounced search input handler
    const debouncedLoadItems = debounce((params) => loadItems(params), 300);

    // Actualizar productos al escribir en el campo de búsqueda
    const onSearchInput = () => {
      debouncedLoadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
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
      onSearchInput,
    };
  },
};
</script>
