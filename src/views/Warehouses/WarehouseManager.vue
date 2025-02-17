<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchWarehouses, deleteWarehouse } from '@/services/WarehouseService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { WarehousePayload } from '@/types/WarehouseTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';

const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

const warehouses = ref<WarehousePayload[]>([]);
const isLoading = ref(false);

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Nombre', value: 'name' },
  { title: 'ID de Local', value: 'location_id' },
  { title: 'Tipo', value: 'type' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

async function loadWarehouses() {
  try {
    isLoading.value = true;
    warehouses.value = await fetchWarehouses();
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  } finally {
    isLoading.value = false;
  }
}

async function handleDelete(id: number) {
  try {
    await deleteWarehouse(id);
    await showSuccessNotification('Éxito', 'Almacén eliminado correctamente');
    await loadWarehouses();
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  }
}

function goToCreate() {
  router.push({ name: 'WarehouseCreate' });
}

function goToEdit(id: number) {
  router.push({ name: 'WarehouseEdit', params: { id: id.toString() } });
}

onMounted(() => {
  loadWarehouses();
});
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Almacenes</h1>
        <v-btn color="primary" @click="goToCreate">
          <i class="fas fa-plus mr-2"></i>
          Nuevo Almacén
        </v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :items="warehouses"
        :loading="isLoading"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <div class="flex gap-2">
            <v-btn color="primary" @click="goToEdit(item.id)" class="ma-2 mr-2">
              <v-icon start>mdi-pencil</v-icon>
              Editar
            </v-btn>
            <v-btn color="error" @click="handleDelete(item.id)">
              <v-icon start>mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-4 text-gray-500">
            No se encontraron almacenes
          </div>
        </template>
      </v-data-table>
    </div>
  </AdminWrapper>
</template>
