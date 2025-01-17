<template>
  <div class="flex flex-col bg-gray-100 container-fill">
    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Center Panel -->
      <div class="flex-1 bg-white p-4 flex flex-col">
        <!-- Search Bar -->
        <div class="flex items-center mb-4">
          <label for="role-search" class="mr-2 font-medium">Buscar Rol:</label>
          <v-text-field
            id="role-search"
            v-model="search"
            placeholder="Buscar rol"
            outlined
            dense
            @keydown.enter="searchRole"
          ></v-text-field>
        </div>
        <p v-if="searchError" class="text-red-500 mb-4">{{ searchError }}</p>

        <!-- Role List Table -->
        <v-data-table
          :headers="headers"
          :items="filteredRoles"
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
              <td class="border px-2 py-1 text-center">
                <v-btn
                  icon
                  color="primary"
                  @click="editRole(role)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="error"
                  @click="deleteRole(role.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>

      <!-- Right Panel -->
      <div class="w-1/4 bg-gray-200 p-4 flex flex-col">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Agregar/Editar Rol</h3>
          <v-text-field
            v-model="newRole.name"
            label="Nombre del Rol"
            outlined
            dense
            class="mb-2"
          ></v-text-field>
          <v-select
            v-model="newRole.permissions"
            :items="permissions"
            item-value="id"
            item-text="name"
            label="Permisos"
            multiple
            outlined
            dense
          ></v-select>
        </div>
        <v-btn
          color="success"
          @click="saveRole"
          :disabled="!newRole.name"
          class="mb-2"
        >
          Guardar Rol
        </v-btn>
        <v-btn
          color="error"
          @click="clearForm"
        >
          Cancelar
        </v-btn>
        <p v-if="formError" class="text-red-500 mt-4">{{ formError }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { fetchRolesWithPermissions, saveRole, deleteRoleById } from '@/services/RolePermissionService';
import type { Role, Permission } from '@/types/RolePermissionTypes';

export default {
  name: 'RolePermissionManager',
  setup() {
    const search = ref('');
    const searchError = ref<string | null>(null);
    const roles = ref<Role[]>([]);
    const permissions = ref<Permission[]>([]);
    const newRole = ref<{ name: string; permissions: number[] }>({
      name: '',
      permissions: [],
    });
    const formError = ref<string | null>(null);

    const headers = [
      { text: 'Nombre del Rol', value: 'name' },
      { text: 'Permisos Asociados', value: 'permissions' },
      { text: 'Acciones', value: 'actions', align: 'center' },
    ];

    const filteredRoles = computed(() => {
      if (!search.value) return roles.value;
      return roles.value.filter((role) =>
        role.name.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const fetchInitialData = async () => {
      try {
        const { roles: fetchedRoles, permissions: fetchedPermissions } =
          await fetchRolesWithPermissions();
        roles.value = fetchedRoles;
        permissions.value = fetchedPermissions;
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
      }
    };

    const saveRoleHandler = async () => {
      try {
        formError.value = null;
        await saveRole(newRole.value);
        await fetchInitialData();
        clearForm();
      } catch (error) {
        console.error('Error saving role:', error);
        formError.value = 'No se pudo guardar el rol. Inténtalo de nuevo.';
      }
    };

    const deleteRole = async (roleId: number) => {
      try {
        await deleteRoleById(roleId);
        await fetchInitialData();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    };

    const editRole = (role: Role) => {
      newRole.value = {
        name: role.name,
        permissions: role.permissions.map((perm) => perm.id),
      };
    };

    const clearForm = () => {
      newRole.value = { name: '', permissions: [] };
    };

    fetchInitialData();

    return {
      search,
      searchError,
      roles,
      permissions,
      newRole,
      formError,
      filteredRoles,
      headers,
      saveRole: saveRoleHandler,
      deleteRole,
      editRole,
      clearForm,
    };
  },
};
</script>

<style scoped>
.table th, .table td {
  padding: 0.5rem;
  text-align: left;
}
</style>
