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
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { Role, Permission } from '@/types/RolePermissionTypes';

export default {
  name: 'RolePermissionEdit',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const role = ref<Role | null>(null); // Datos del rol
    const allPermissions = ref<Permission[]>([]); // Lista de todos los permisos disponibles
    const selectedPermissions = ref<number[]>([]); // IDs de los permisos seleccionados

    const { showSuccessNotification, showErrorNotification } = useNotification();
    const { errors, errorMessage, handleValidationError } = useFormValidation();

    const roleId = route.params.roleId as string;

    const loadRoleAndPermissions = async () => {
      try {
        role.value = null;
        allPermissions.value = [];
        const fetchedRole = await fetchRoleById(roleId);
        role.value = fetchedRole;

        const fetchedPermissions = await fetchAllPermissions();
        allPermissions.value = fetchedPermissions;

        selectedPermissions.value =
          fetchedRole.permissions.map((permission) => permission.id) || [];
      } catch (error) {
        handleValidationError(error);
        if (errorMessage.value) {
          showErrorNotification('Error al cargar datos', errorMessage.value);
        }
      }
    };

    const savePermissions = async () => {
      try {
        await updateRolePermissions(roleId, selectedPermissions.value);
        await showSuccessNotification(
          'Permisos Actualizados',
          'Los permisos del rol se actualizaron correctamente.', // Ruta de redirección después de guardar
        );
      } catch (error) {
        handleValidationError(error);
        if (errorMessage.value) {
          showErrorNotification('Error al guardar', errorMessage.value);
        }
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
      errors,
      errorMessage,
    };
  },
};
</script>
