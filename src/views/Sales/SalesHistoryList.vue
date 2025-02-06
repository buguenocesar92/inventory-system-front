<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSalesHistory } from "@/composables/useSalesHistory";
import AdminWrapper from "@/components/AdminWrapper.vue";

const router = useRouter();

const {
  itemsPerPage,
  isLoading,
  serverItems,
  totalItems,
  search,
  headers,
  errorMessage,
  loadItems,
  onSearchInput,
} = useSalesHistory();
</script>

<template>
  <AdminWrapper>
    <div class="px-4 sm:px-6 lg:px-8 py-4">
      <!-- Título -->
      <h1 class="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Historial de Ventas
      </h1>

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
        class="elevation-1 !shadow-lg !rounded-lg !overflow-hidden"
        dense
        loading-text="Cargando historial de ventas..."
      >
        <!-- Columna de acciones -->
        <!-- eslint-disable vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-btn
            color="info"
            @click="router.push({ name: 'SaleDetail', params: { id: item.id } })"
          >
            <v-icon start>mdi-information</v-icon>
            Detalles
          </v-btn>
        </template>
      </v-data-table-server>

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-500 mt-2 text-center sm:text-left">
        {{ errorMessage }}
      </p>
    </div>
  </AdminWrapper>
</template>
