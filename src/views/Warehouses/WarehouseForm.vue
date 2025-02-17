<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createWarehouse, updateWarehouse, fetchWarehouseById } from '@/services/WarehouseService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { WarehousePayload } from '@/types/WarehouseTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';
import GoBackButton from '@/components/GoBackButton.vue';

const route = useRoute();
const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotification();
const { errors, errorMessage, handleValidationError } = useFormValidation();

const isEditing = ref<boolean>(!!route.params.id);
const isLoading = ref(false);
const warehouse = ref<WarehousePayload>({
  id: 0,
  location_id: 0,
  name: '',
  type: ''
});

// Cargar datos si es edición
async function loadWarehouse() {
  if (isEditing.value) {
    try {
      isLoading.value = true;
      warehouse.value = await fetchWarehouseById(Number(route.params.id));
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
      router.push('/warehouses');
    } finally {
      isLoading.value = false;
    }
  }
}

// Manejar envío del formulario
async function handleSubmit() {
  try {
    isLoading.value = true;
    if (isEditing.value) {
      await updateWarehouse(warehouse.value.id, warehouse.value);
      await showSuccessNotification('Éxito', 'Almacén actualizado correctamente');
    } else {
      await createWarehouse(warehouse.value);
      await showSuccessNotification('Éxito', 'Almacén creado correctamente');
    }
    router.push('/warehouses');
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (isEditing.value) {
    loadWarehouse();
  }
});
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">
          {{ isEditing ? 'Editar Almacén' : 'Crear Nuevo Almacén' }}
        </h1>
        <GoBackButton />
      </div>

      <div class="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
        <form @submit.prevent="handleSubmit">
          <!-- ID de Local -->
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="location_id">ID de Local</label>
            <input
              v-model="warehouse.location_id"
              type="number"
              id="location_id"
              class="w-full px-3 py-2 border rounded-lg"
              required
            />
            <p v-if="errors.location_id" class="text-red-500 text-sm">{{ errors.location_id[0] }}</p>
          </div>

          <!-- Nombre -->
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="name">Nombre</label>
            <input
              v-model="warehouse.name"
              type="text"
              id="name"
              class="w-full px-3 py-2 border rounded-lg"
              required
            />
            <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name[0] }}</p>
          </div>

          <!-- Tipo -->
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="type">Tipo</label>
            <input
              v-model="warehouse.type"
              type="text"
              id="type"
              class="w-full px-3 py-2 border rounded-lg"
              required
            />
            <p v-if="errors.type" class="text-red-500 text-sm">{{ errors.type[0] }}</p>
          </div>

          <!-- Botón de Guardar -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Almacén' : 'Crear Almacén') }}
          </button>
        </form>
      </div>
    </div>
  </AdminWrapper>
</template>
