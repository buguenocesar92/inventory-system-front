<!-- src/views/RolesPermissions/RolePermissionManager.vue -->
<script setup lang="ts">
import { ref, onMounted, defineOptions } from 'vue';
import { useRouter } from 'vue-router';
import GoToRegisterButton from '@/components/GoToRegisterButton.vue';
import { fetchRolesWithPermissions } from '@/services/RolePermissionService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { Role, Permission } from '@/types/RoleTypes';

// (Opcional) Asigna nombre al componente
defineOptions({ name: 'RolePermissionList' });

// Estado local
const roles = ref<Role[]>([]);
const allPermissions = ref<Permission[]>([]); // Podrías usarlo más adelante si lo necesitas

const headers = [
  { title: 'Nombre del Rol', value: 'name' },
  { title: 'Permisos Asociados', value: 'permissions' },
  { title: 'Usuarios Asociados', value: 'users' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

// Router y composables
const router = useRouter();
const { showErrorNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

/**
 * Carga roles y permisos
 */
async function fetchRoles() {
  try {
    // Desestructuramos el objeto que retorna el servicio:
    // { roles: Role[], permissions: Permission[] }
    const { roles: fetchedRoles, permissions: fetchedPermissions } = await fetchRolesWithPermissions();
    roles.value = fetchedRoles;
    allPermissions.value = fetchedPermissions;
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Error!', errorMessage.value);
    }
  }
}

/**
 * Navega a la pantalla de edición de un rol
 */
function goToRoleEdit(roleId: number) {
  try {
    router.push({ name: 'RolePermissionEdit', params: { roleId: roleId.toString() } });
  } catch (error) {
    handleValidationError(error);
    if (errorMessage.value) {
      showErrorNotification('Navigation Error', errorMessage.value);
    }
  }
}

// Cargar roles al montar el componente
onMounted(fetchRoles);
</script>
<template>
  <div class="flex flex-col bg-gray-100">
    <!-- Botón para registro (opcional) -->
    <GoToRegisterButton />

    <div class="flex flex-1 overflow-hidden">
      <!-- Tabla de Roles -->
      <div class="flex-1 bg-white p-4 flex flex-col">
        <v-data-table
          :headers="headers"
          :items="roles"
          class="elevation-1 flex-1"
          dense
        >
          <template #body="{ items }">
            <tr v-for="(role, index) in items" :key="index">
              <td class="border px-2 py-1">{{ role.name }}</td>

              <!-- Permisos (asociados a cada rol) -->
              <td class="border px-2 py-1">
                <ul>
                  <li v-for="permission in role.permissions" :key="permission.id">
                    {{ permission.name }}
                  </li>
                </ul>
              </td>

              <!-- Usuarios asociados al rol -->
              <td class="border px-2 py-1">
                <ul>
                  <li v-for="user in role.users" :key="user.id">
                    {{ user.name }} ({{ user.email }})
                  </li>
                </ul>
              </td>

              <!-- Columna Acciones (Editar) -->
              <td class="border px-2 py-1">
                <v-btn color="primary" @click="goToRoleEdit(role.id)">
                  Editar
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>
