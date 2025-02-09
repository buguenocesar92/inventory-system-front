<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createLocation, updateLocation, fetchLocationById } from '@/services/LocationService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { LocationPayload } from '@/types/LocationTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';
import GoBackButton from '@/components/GoBackButton.vue';

const route = useRoute();
const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotification();
const { errors, errorMessage, handleValidationError } = useFormValidation();

const isEditing = ref<boolean>(!!route.params.id);
const isLoading = ref(false);
const location = ref<LocationPayload>({
  id: 0,
  name: '',
  address: '',
  phone: '',
  status: 'active',
});

// Cargar datos si es edición
async function loadLocation() {
  if (isEditing.value) {
    try {
      isLoading.value = true;
      location.value = await fetchLocationById(Number(route.params.id));
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
      router.push('/locations'); // Redirigir si hay error
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
      await updateLocation(location.value.id, location.value);
      await showSuccessNotification('Éxito', 'Local actualizado correctamente');
    } else {
      await createLocation(location.value);
      await showSuccessNotification('Éxito', 'Local creado correctamente');
    }
    router.push('/locations');
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
    loadLocation();
  }
});
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">
          {{ isEditing ? 'Editar Local' : 'Crear Nuevo Local' }}
        </h1>
        <GoBackButton />
      </div>

      <div class="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
        <form @submit.prevent="handleSubmit">
          <!-- Nombre -->
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="name">Nombre</label>
            <input
              v-model="location.name"
              type="text"
              id="name"
              class="w-full px-3 py-2 border rounded-lg"
              required
            />
            <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name[0] }}</p>
          </div>

          <!-- Dirección -->
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="address">Dirección</label>
            <input
              v-model="location.address"
              type="text"
              id="address"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <!-- Teléfono -->
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="phone">Teléfono</label>
            <input
              v-model="location.phone"
              type="text"
              id="phone"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <!-- Estado -->
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">Estado</label>
            <select v-model="location.status" class="w-full px-3 py-2 border rounded-lg">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          <!-- Botón de Guardar -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isLoading ? 'Guardando...' : 'Guardar Local' }}
          </button>
        </form>
      </div>
    </div>
  </AdminWrapper>
</template>
