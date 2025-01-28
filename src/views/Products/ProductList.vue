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
    <div class="px-4 sm:px-6 lg:px-8 py-4">
      <!-- Título -->
      <h1 class="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Lista de Productos
      </h1>

      <!-- Botón Crear Producto -->
      <div class="flex justify-center sm:justify-start mb-5">
        <RouterLink
          to="/add-product"
          class="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Crear Producto
        </RouterLink>
      </div>

      <!-- Barra de búsqueda -->
      <div class="flex justify-center sm:justify-start mb-4">
        <v-text-field
          v-model="search"
          label="Buscar"
          class="w-full sm:w-96 rounded-lg overflow-hidden"
          outlined
          dense
          @input="onSearchInput"
        />
      </div>

      <!-- Tabla de datos -->
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="isLoading"
        item-value="id"
        @update:options="loadItems"
        class="elevation-1 shadow-lg rounded-lg overflow-hidden"
        dense
        loading-text="Cargando productos..."
      >
        <!-- Columna de acciones -->
        <!-- eslint-disable vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
            <!-- Botón Editar -->
            <v-btn
              color="primary"
              @click="router.push({ name: 'EditProduct', params: { id: item.id } })"
              class="ma-2 mr-2"
            >
              <v-icon start>mdi-pencil</v-icon>
              Editar
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
              Eliminar
            </v-btn>

            <!-- Botón Agregar Stock -->
            <v-btn
              color="success"
              @click="router.push({ name: 'MovementForm', params: { id: item.id, movementType: 'entry' } })"
              class="ma-2 mr-2"
            >
              <v-icon start>mdi-plus</v-icon>
              Agregar Stock
            </v-btn>

            <!-- Botón Quitar Stock -->
            <v-btn
              color="warning"
              @click="router.push({ name: 'MovementForm', params: { id: item.id, movementType: 'exit' } })"
              class="ma-2 mr-2"
            >
              <v-icon start>mdi-minus</v-icon>
              Quitar Stock
            </v-btn>

            <!-- Botón Historial de Movimientos -->
            <v-btn
              color="info"
              @click="router.push({ name: 'InventoryMovementHistory', params: { productId: item.id } })"
              class="ma-2 mr-2"
            >
              <v-icon start>mdi-history</v-icon>
              Historial de Movimientos
            </v-btn>
          </div>
        </template>
      </v-data-table-server>

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-500 mt-2 text-center sm:text-left">
        {{ errorMessage }}
      </p>
    </div>
  </AdminWrapper>
</template>
