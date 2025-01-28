<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProductList } from "@/composables/useProductList";
import AdminWrapper from "@/components/AdminWrapper.vue";

const router = useRouter();

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

function deleteProduct(id: number) {
  deleteProductHandler(id);
}
</script>

<template>
  <AdminWrapper>
    <h1 class="text-2xl font-bold mb-4">Lista de Productos</h1>
    <RouterLink
      to="/add-product"
      class="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-5"
    >
      Crear Producto
    </RouterLink>

    <!-- Barra de búsqueda -->
    <v-text-field
      v-model="search"
      label="Buscar"
      class="mb-4 mt-4"
      outlined
      dense
      @input="onSearchInput"
    />

    <!-- Tabla de datos -->
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
      <!-- eslint-disable vue/valid-v-slot -->
      <template #item.actions="{ item }">
        <v-btn
          color="primary"
          @click="router.push({ name: 'EditProduct', params: { id: item.id } })"
          class="ma-2 mr-2"
        >
          <v-icon start>mdi-pencil</v-icon>
          Edit
        </v-btn>

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

        <v-btn
          color="success"
          @click="router.push({ name: 'MovementForm', params: { id: item.id, movementType: 'entry' } })"
          class="ma-2 mr-2"
        >
          <v-icon start>mdi-plus</v-icon>
          Add Stock
        </v-btn>

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

    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </AdminWrapper>
</template>
