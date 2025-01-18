<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Editar Rol: {{ role?.name }}</h2>

    <!-- Mostrar todos los permisos con checkboxes -->
    <div v-if="allPermissions.length > 0">
      <h3 class="text-lg font-semibold mb-2">Permisos:</h3>
      <ul>
        <li
          v-for="permission in allPermissions"
          :key="permission.id"
          class="mb-1 flex items-center"
        >
          <input
            type="checkbox"
            :value="permission.id"
            v-model="selectedPermissions"
            class="mr-2"
          />
          {{ permission.name }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Cargando permisos...</p>
    </div>

    <div class="mt-4">
      <v-btn color="primary" @click="savePermissions">
        Guardar Cambios
      </v-btn>
      <v-btn color="secondary" @click="goBack">
        Volver
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchRoleById, fetchAllPermissions, updateRolePermissions } from '@/services/RolePermissionService';
import type { Role, Permission } from '@/types/RolePermissionTypes';

export default {
  name: 'RolePermissionEdit',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const role = ref<Role | null>(null); // Datos del rol
    const allPermissions = ref<Permission[]>([]); // Lista de todos los permisos disponibles
    const selectedPermissions = ref<number[]>([]); // IDs de los permisos seleccionados

    const roleId = route.params.roleId as string;

    const loadRoleAndPermissions = async () => {
      try {
        // Inicializar `role` y `allPermissions` como listas vacías
        role.value = null;
        allPermissions.value = [];

        // Cargar los datos del rol y los permisos disponibles
        const fetchedRole = await fetchRoleById(roleId);
        role.value = fetchedRole;

        const fetchedPermissions = await fetchAllPermissions();
        allPermissions.value = fetchedPermissions;

        // Inicializar los permisos seleccionados según el rol actual
        selectedPermissions.value =
          fetchedRole.permissions.map((permission) => permission.id) || [];
      } catch (error) {
        console.error('Error al cargar los datos del rol y permisos:', error);
      }
    };

    const savePermissions = async () => {
      try {
        // Enviar permisos seleccionados al backend
        await updateRolePermissions(roleId, selectedPermissions.value);

        alert('Permisos actualizados correctamente.');
      } catch (error) {
        console.error('Error al guardar los permisos:', error);
        alert('Hubo un error al guardar los permisos.');
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(loadRoleAndPermissions);

    return {
      role,
      allPermissions,
      selectedPermissions,
      savePermissions,
      goBack,
    };
  },
};
</script>
