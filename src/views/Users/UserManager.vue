<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAllUsersWithLocations, /* deleteUser */ } from '@/services/UserService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { User } from '@/types/UserTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';

const router = useRouter();
const { /* showSuccessNotification, */ showErrorNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

const users = ref<User[]>([]);
const isLoading = ref(false);

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Nombre', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Location', value: 'location.name' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

async function loadUsers() {
  try {
    isLoading.value = true;
    users.value = await fetchAllUsersWithLocations();
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  } finally {
    isLoading.value = false;
  }
}

/* async function handleDelete(id: number) {
  try {
    await deleteUser(id);
    await showSuccessNotification('Éxito', 'Usuario eliminado correctamente');
    await loadUsers();
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error', errorMessage.value);
    }
  }
} */

function goToCreate() {
  router.push({ name: 'RegisterUser' });
}

/* function goToEdit(id: number) {
  router.push({ name: 'UserEdit', params: { id: id.toString() } });
}
 */
onMounted(() => {
  loadUsers();
});
</script>

<template>
  <AdminWrapper>
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestión de Usuarios</h1>
        <v-btn color="primary" @click="goToCreate">
          <i class="fas fa-plus mr-2"></i>
          Nuevo Usuario
        </v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :items="users"
        :loading="isLoading"
        class="elevation-1"
      >
        <!-- eslint-disable vue/valid-v-slot -->
<!--         <template #item.actions="{ item }">
          <div class="flex gap-2">
            <v-btn color="primary" @click="goToEdit(item.id!)">
              <v-icon start>mdi-pencil</v-icon>
              Editar
            </v-btn>

            <v-btn color="error" @click="handleDelete(item.id!)">
              <v-icon start>mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </div>
        </template> -->

        <template #no-data>
          <div class="text-center py-4 text-gray-500">
            No se encontraron usuarios
          </div>
        </template>
      </v-data-table>
    </div>
  </AdminWrapper>
</template>
