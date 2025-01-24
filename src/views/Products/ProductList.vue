<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useProductList } from '@/composables/useProductList';

const router = useRouter();

// Obtenemos todo del composable
const {
  itemsPerPage,
  isLoading,
  serverItems,
  totalItems,
  search,
  deletingProductId,
  headers,
  errorMessage,
  loadItems,
  deleteProductHandler,
  onSearchInput,
} = useProductList();

// Función que llamamos en el template para eliminar producto
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
        <v-btn
          color="info"
          @click="router.push({ name: 'InventoryMovementHistory', params: { productId: item.id } })"
          class="ma-2 mr-2"
        >
          <v-icon start>mdi-history</v-icon>
          Movement History
        </v-btn>
      </template>
    </v-data-table-server>

    <!-- Errores generales -->
    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </div>
</template>
