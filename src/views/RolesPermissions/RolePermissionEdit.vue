<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Editar Rol: {{ role?.name }}</h2>

    <!-- Mostrar permisos del rol con checkboxes -->
    <div v-if="role">
      <h3 class="text-lg font-semibold mb-2">Permisos:</h3>
      <ul>
        <li
          v-for="permission in role.permissions"
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
      <p>Cargando datos del rol...</p>
    </div>

    <div class="mt-4">
      <v-btn color="secondary" @click="goBack">
        Volver
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchRoleById } from '@/services/RolePermissionService';
import type { Role } from '@/types/RolePermissionTypes';

export default {
  name: 'RolePermissionEdit',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const role = ref<Role | null>(null); // Datos del rol
    const selectedPermissions = ref<number[]>([]); // Permisos seleccionados

    const roleId = route.params.roleId as string;

    const loadRole = async () => {
      try {
        // Obtener el rol y sus permisos actuales
        role.value = await fetchRoleById(roleId);

        // Inicializar los permisos seleccionados con los permisos actuales del rol
        selectedPermissions.value =
          role.value?.permissions.map((permission) => permission.id) || [];
      } catch (error) {
        console.error('Error al cargar los datos del rol:', error);
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(loadRole);

    return {
      role,
      selectedPermissions,
      goBack,
    };
  },
};
</script>
