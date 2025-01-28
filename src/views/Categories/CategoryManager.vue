<!-- src/views/Categories/CategoryManager.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCategories, deleteCategory } from '@/services/CategoryService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { CategoryPayload } from '@/types/CategoryTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';


const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

const categories = ref<CategoryPayload[]>([]);
const isLoading = ref(false);

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Nombre', value: 'name' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

async function loadCategories() {
  try {
    isLoading.value = true;
    categories.value = await fetchCategories();
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
    await deleteCategory(id);
    await showSuccessNotification('Éxito', 'Categoría eliminada correctamente');
    await loadCategories();
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  }
}

function goToCreate() {
  router.push({ name: 'CategoryCreate' });
}

function goToEdit(id: number) {
  router.push({ name: 'CategoryEdit', params: { id: id.toString() } });
}

onMounted(() => {
  loadCategories();
});
</script>
<!-- eslint-disable vue/valid-v-slot -->
<template>
   <AdminWrapper>
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Categorías</h1>
        <v-btn color="primary" @click="goToCreate">
          <i class="fas fa-plus mr-2"></i>
          Nueva Categoría
        </v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :items="categories"
        :loading="isLoading"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <div class="flex gap-2">
            <v-btn
            color="primary"
            @click="goToEdit(item.id!)"
            class="ma-2 mr-2"
          >
            <v-icon start>mdi-pencil</v-icon>
            Edit
          </v-btn>

            <v-btn
              color="error"
              @click="handleDelete(item.id!)"
            >
            <v-icon start>mdi-delete</v-icon>
            Eliminar
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-4 text-gray-500">
            No se encontraron categorías
          </div>
        </template>
      </v-data-table>
    </div>
  </AdminWrapper>
</template>
