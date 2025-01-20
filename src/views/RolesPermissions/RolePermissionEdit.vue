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

    <!-- Mostrar todos los usuarios con checkboxes -->
    <div v-if="allUsers.length > 0" class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Usuarios:</h3>
      <p>Selecciona quién tendrá este rol:</p>
      <ul>
        <li
          v-for="user in allUsers"
          :key="user.id"
          class="mb-1 flex items-center"
        >
          <input
            type="checkbox"
            :value="user.id"
            v-model="selectedUsers"
            class="mr-2"
          />
          <span><strong>{{ user.name }}</strong> ({{ user.email }})</span>
        </li>
      </ul>
    </div>
    <div v-else class="mt-4">
      <p>No hay usuarios disponibles.</p>
    </div>

    <div class="mt-4">
      <v-btn color="primary" @click="saveChanges">
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
import {
  fetchRoleById,
  fetchAllPermissions,
  updateRolePermissions,
} from '@/services/RolePermissionService';
import {
  updateRoleUsers,
  fetchAllUsers,
} from '@/services/UserService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { User } from '@/types/UserTypes'
import type { Role, Permission } from '@/types/RoleTypes';

export default {
  name: 'RolePermissionEdit',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const role = ref<Role | null>(null); // Datos del rol
    const allPermissions = ref<Permission[]>([]); // Lista de todos los permisos disponibles
    const allUsers = ref<User[]>([]); // Lista de todos los usuarios disponibles
    const selectedPermissions = ref<number[]>([]); // IDs de los permisos seleccionados
    const selectedUsers = ref<number[]>([]); // IDs de los usuarios seleccionados

    const { showSuccessNotification, showErrorNotification } = useNotification();
    const { errors, errorMessage, handleValidationError } = useFormValidation();

    const roleId = route.params.roleId as string;

    const loadRoleData = async () => {
      try {
        // Limpiar datos iniciales
        role.value = null;
        allPermissions.value = [];
        allUsers.value = [];

        // Cargar el rol y los permisos
        const fetchedRole = await fetchRoleById(roleId);
        role.value = fetchedRole;

        const fetchedPermissions = await fetchAllPermissions();
        allPermissions.value = fetchedPermissions;

        // Inicializar permisos seleccionados
        selectedPermissions.value =
          fetchedRole.permissions.map((permission) => permission.id) || [];

        // Cargar todos los usuarios
        const fetchedUsers = await fetchAllUsers();
        allUsers.value = fetchedUsers;

        // Inicializar usuarios seleccionados
        selectedUsers.value = fetchedRole.users.map((user) => user.id);
      } catch (error) {
        handleValidationError(error);
        if (errorMessage.value) {
          showErrorNotification('Error al cargar datos', errorMessage.value);
        }
      }
    };

    const saveChanges = async () => {
      try {
        // Actualizar permisos del rol
        await updateRolePermissions(roleId, selectedPermissions.value);

        // Actualizar usuarios asociados al rol
        await updateRoleUsers(roleId, selectedUsers.value);

        await showSuccessNotification(
          'Cambios Guardados',
          'Los permisos y usuarios del rol se actualizaron correctamente.',
        );
      } catch (error) {
        handleValidationError(error);
        if (errorMessage.value) {
          showErrorNotification('Error al guardar cambios', errorMessage.value);
        }
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(loadRoleData);

    return {
      role,
      allPermissions,
      allUsers,
      selectedPermissions,
      selectedUsers,
      saveChanges,
      goBack,
      errors,
      errorMessage,
    };
  },
};
</script>
