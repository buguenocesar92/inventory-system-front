<!-- src/views/Products/ProductList.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchProducts, deleteProduct as deleteProductService  } from '@/services/ProductService';
import { debounce } from '@/utils/debounce';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { ProductPayload, FetchProductsResponse } from '@/types/ProductTypes';

/**
 * Estado local
 */
const router = useRouter();
const itemsPerPage = ref(5);
const isLoading = ref(false);
const serverItems = ref<ProductPayload[]>([]);
const totalItems = ref(0);
const search = ref('');
const deletingProductId = ref<number | null>(null);

// Para manejar validaciones y notificaciones
const { showSuccessNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

/**
 * Columnas de la tabla
 */
const headers = ref([
  { title: 'Name', value: 'name', sortable: true },
  { title: 'Category', value: 'category', sortable: true },
  { title: 'Unit Price', value: 'unit_price', sortable: true },
  { title: 'Current Stock', value: 'current_stock', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false },
]);

/**
 * Tipado de la configuración que VDataTableServer dispara
 * al hacer paginación, sort, etc.
 */
interface DataTableParams {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: string }[];
}

/**
 * Carga los productos del servidor según params
 */
async function loadItems(params: DataTableParams) {
  isLoading.value = true;
  try {
    const { items, total }: FetchProductsResponse = await fetchProducts({
      page: params.page,
      itemsPerPage: params.itemsPerPage,
      sortBy: params.sortBy,
      search: search.value,
    });
    serverItems.value = items;
    totalItems.value = total;
  } catch (error) {
    handleValidationError(error);
  } finally {
    isLoading.value = false;
  }
}

/**
 * Elimina un producto por su ID
 */
async function deleteProductHandler(id: number) {
  deletingProductId.value = id;
  try {
    await deleteProductService(id);
    await showSuccessNotification('Success!', 'Product updated successfully.', '/list-product');
    serverItems.value = serverItems.value.filter((product) => product.id !== id);
  } catch (error) {
    handleValidationError(error);
    // Si es un error de permisos:
    if (errorMessage.value === 'You do not have permission to perform this action.') {
      router.push('/403');
    }
  } finally {
    deletingProductId.value = null;
  }
}

/**
 * Debounce para no sobrecargar la búsqueda
 */
const debouncedLoadItems = debounce((params: DataTableParams) => loadItems(params), 300);

/**
 * Al escribir en el campo de búsqueda,
 * recargamos los items desde la página 1
 */
function onSearchInput() {
  debouncedLoadItems({
    page: 1,
    itemsPerPage: itemsPerPage.value,
    sortBy: [],
  });
}

// Exponemos funciones y estado para usarlas en el template
// (Con <script setup> no hace falta "return", podemos usarlas directamente)
function deleteProduct(id: number) {
  deleteProductHandler(id);
}
</script>
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Product List</h1>

    <RouterLink
      to="/add-product"
      class="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-5"
    >
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
    />

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
      <template #item.actions="{ item }">
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
