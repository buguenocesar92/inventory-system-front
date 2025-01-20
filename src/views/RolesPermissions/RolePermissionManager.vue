<template>
  <div class="flex flex-col bg-gray-100">
    <!-- Main Content -->
    <GoToRegisterButton />
    <div class="flex flex-1 overflow-hidden">
      <!-- Center Panel -->
      <div class="flex-1 bg-white p-4 flex flex-col">
        <!-- Role List Table -->

        <v-data-table
          :headers="headers"
          :items="roles"
          class="elevation-1 flex-1"
          dense
        >
          <template v-slot:body="{ items }">
            <tr v-for="(role, index) in items" :key="index">
              <td class="border px-2 py-1">{{ role.name }}</td>
              <td class="border px-2 py-1">
                <ul>
                  <li v-for="permission in role.permissions" :key="permission.id">
                    {{ permission.name }}
                  </li>
                </ul>
              </td>
              <td class="border px-2 py-1">
                <ul>
                  <li v-for="user in role.users" :key="user.id">
                    {{ user.name }} ({{ user.email }})
                  </li>
                </ul>
              </td>
              <!-- New Edit Button Column -->
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

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRolesWithPermissions } from '@/services/RolePermissionService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { Role } from '@/types/RoleTypes';
import GoToRegisterButton from '@/components/GoToRegisterButton.vue'


export default {
  name: 'RolePermissionList',
  components: {
    GoToRegisterButton,
  },
  setup() {
    const roles = ref<Role[]>([]);
    const router = useRouter();
    const { showErrorNotification } = useNotification();
    const { errors, errorMessage, handleValidationError } = useFormValidation();

    const headers = [
      { title: 'Nombre del Rol', value: 'name' },
      { title: 'Permisos Asociados', value: 'permissions' },
      { title: 'Usuarios Asociados', value: 'users' }, // Nueva columna para usuarios
      { title: 'Acciones', value: 'actions', sortable: false },
    ];

    const fetchRoles = async () => {
      try {
        const { roles: fetchedRoles } = await fetchRolesWithPermissions();
        roles.value = fetchedRoles;
      } catch (error) {
        handleValidationError(error);
        if (errorMessage.value) {
          showErrorNotification('Error!', errorMessage.value);
        }
      }
    };

    const goToRoleEdit = (roleId: number) => {
      try {
        router.push({ name: 'RolePermissionEdit', params: { roleId: roleId.toString() } });
      } catch (error) {
        handleValidationError(error);
        if (errorMessage.value) {
          showErrorNotification('Navigation Error', errorMessage.value);
        }
      }
    };

    onMounted(fetchRoles);

    return {
      roles,
      headers,
      goToRoleEdit,
      errors,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.table th,
.table td {
  padding: 0.5rem;
  text-align: left;
}
</style>
