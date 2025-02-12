<!-- src/views/Users/UserForm.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createUser, updateUser, fetchAllUsers } from '@/services/UserService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { User } from '@/types/UserTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';

const route = useRoute();
const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotification();
const { errors, errorMessage, handleValidationError } = useFormValidation();

const isEditing = ref(false);
const isLoading = ref(false);
// Inicializamos el objeto usuario. En edición, la contraseña puede quedar vacía para indicar que no se desea actualizar.
const user = ref<User>({ id: 0, name: '', email: '', password: '' });

async function handleSubmit() {
  try {
    isLoading.value = true;

    if (isEditing.value) {
      await updateUser(Number(route.params.id), user.value);
      showSuccessNotification('Éxito', 'Usuario actualizado correctamente');
    } else {
      await createUser({ ...user.value, password: user.value.password || '' });
      showSuccessNotification('Éxito', 'Usuario creado correctamente');
    }

    router.push({ name: 'Users' });
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
  // Si la ruta corresponde a la edición (por ejemplo, nombre de ruta "UserEdit"),
  // se carga la información del usuario para editar.
  if (route.name === 'UserEdit') {
    isEditing.value = true;
    try {
      const users = await fetchAllUsers();
      const foundUser = users.find(u => u.id === Number(route.params.id));
      if (foundUser) {
        user.value = foundUser;
      }
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
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">
        {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Campo para Nombre -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nombre</label>
          <input
            v-model="user.name"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name[0] }}</p>
        </div>

        <!-- Campo para Email -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input
            v-model="user.email"
            type="email"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email[0] }}</p>
        </div>

        <!-- Campo para Contraseña -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Contraseña</label>
          <input
            v-model="user.password"
            type="password"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password[0] }}</p>
          <p v-if="isEditing" class="text-gray-500 text-sm mt-1">
            Dejar en blanco si no desea cambiar la contraseña.
          </p>
        </div>

        <!-- Botón de envío -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Guardando...' : 'Guardar' }}
        </button>
      </form>
    </div>
  </AdminWrapper>
</template>
