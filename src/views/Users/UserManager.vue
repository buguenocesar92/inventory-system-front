<script setup lang="ts">
import AdminWrapper from '@/components/AdminWrapper.vue';
import { useUserManagement } from '@/composables/useUserManagement';

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Nombre', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Location', value: 'location.name' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

const { users, isLoading, removeUser, goToCreate, goToEdit } = useUserManagement();
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
        <!-- Template para mostrar los botones de acciones (Editar / Eliminar) -->
        <!-- eslint-disable vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <div class="flex gap-2">
            <v-btn color="primary" @click="goToEdit(item.id)">
              <v-icon start>mdi-pencil</v-icon>
              Editar
            </v-btn>
            <v-btn color="error" @click="removeUser(item.id)">
              <v-icon start>mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-4 text-gray-500">
            No se encontraron usuarios
          </div>
        </template>
      </v-data-table>
    </div>
  </AdminWrapper>
</template>
