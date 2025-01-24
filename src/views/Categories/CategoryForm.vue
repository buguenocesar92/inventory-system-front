<!-- src/views/Categories/CategoryForm.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchCategories, createCategory, updateCategory } from '@/services/CategoryService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { CategoryPayload } from '@/types/CategoryTypes';

const route = useRoute();
const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotification();
const { errors, errorMessage, handleValidationError } = useFormValidation();

const isEditing = ref(false);
const isLoading = ref(false);
const category = ref<CategoryPayload>({ id: 0, name: '', description: '' });

async function handleSubmit() {
  try {
    isLoading.value = true;

    if (isEditing.value) {
      await updateCategory(Number(route.params.id), category.value);
      await showSuccessNotification('Éxito', 'Categoría actualizada correctamente');
    } else {
      await createCategory(category.value);
      await showSuccessNotification('Éxito', 'Categoría creada correctamente');
    }

    router.push({ name: 'Categories' });
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  if (route.name === 'CategoryEdit') {
    isEditing.value = true;
    try {
      const categories = await fetchCategories();
      const foundCategory = categories.find(c => c.id === Number(route.params.id));
      if (foundCategory) category.value = foundCategory;
    } catch (error) {
      handleValidationError(error);
      if (errorMessage.value) {
        showErrorNotification('Error', errorMessage.value);
      }
    }
  }
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-md">
    <h2 class="text-2xl font-bold mb-6">
      {{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Nombre</label>
        <input
          v-model="category.name"
          type="text"
          class="w-full px-3 py-2 border rounded"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name[0] }}</p>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ isLoading ? 'Guardando...' : 'Guardar' }}
      </button>
    </form>
  </div>
</template>
