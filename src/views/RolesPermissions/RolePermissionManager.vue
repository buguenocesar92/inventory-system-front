<template>
  <div class="flex flex-col bg-gray-100">
    <!-- Main Content -->
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
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { fetchRolesWithPermissions } from '@/services/RolePermissionService';
import type { Role } from '@/types/RolePermissionTypes';

export default {
  name: 'RolePermissionList',
  setup() {
    const roles = ref<Role[]>([]);

    const headers = [
      { text: 'Nombre del Rol', value: 'name' },
      { text: 'Permisos Asociados', value: 'permissions' },
    ];

    const fetchRoles = async () => {
      try {
        const { roles: fetchedRoles } = await fetchRolesWithPermissions();
        roles.value = fetchedRoles;
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
      }
    };

    onMounted(fetchRoles);

    return {
      roles,
      headers,
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
