<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchLocations, deleteLocation } from '@/services/LocationService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { LocationPayload } from '@/types/LocationTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';

const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

const locations = ref<LocationPayload[]>([]);
const isLoading = ref(false);

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Nombre', value: 'name' },
  { title: 'Dirección', value: 'address' },
  { title: 'Teléfono', value: 'phone' },
  { title: 'Estado', value: 'status' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

async function loadLocations() {
  try {
    isLoading.value = true;
    locations.value = await fetchLocations();
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
    await deleteLocation(id);
    await showSuccessNotification('Éxito', 'Local eliminado correctamente');
    await loadLocations();
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  }
}

function goToCreate() {
  router.push({ name: 'LocationCreate' });
}

function goToEdit(id: number) {
  router.push({ name: 'LocationEdit', params: { id: id.toString() } });
}

onMounted(() => {
  loadLocations();
});
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Locales</h1>
        <v-btn color="primary" @click="goToCreate">
          <i class="fas fa-plus mr-2"></i>
          Nuevo Local
        </v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :items="locations"
        :loading="isLoading"
        class="elevation-1"
      >
      <!-- eslint-disable vue/valid-v-slot -->
        <template #item.status="{ item }">
          <v-chip :color="item.status === 'active' ? 'green' : 'red'" dark>
            {{ item.status === 'active' ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="flex gap-2">
            <v-btn color="primary" @click="goToEdit(item.id!)" class="ma-2 mr-2">
              <v-icon start>mdi-pencil</v-icon>
              Editar
            </v-btn>

            <v-btn color="error" @click="handleDelete(item.id!)">
              <v-icon start>mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-4 text-gray-500">
            No se encontraron locales
          </div>
        </template>
      </v-data-table>
    </div>
  </AdminWrapper>
</template>
