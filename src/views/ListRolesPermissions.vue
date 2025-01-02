<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-4xl bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Roles y Permisos</h1>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        @click="isCreateModalOpen = true"
      >
        Crear Nuevo Rol
      </button>

      <!-- Tabla de Roles -->
      <RoleTable :roles="roles" @update="selectRoleForUpdate" @confirmDelete="confirmDelete" />

      <!-- Mensaje si no hay datos -->
      <p v-if="roles.length === 0" class="text-gray-500 mt-4 text-center">
        No hay roles ni permisos para mostrar.
      </p>

      <!-- Mensaje de Error -->
      <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
    </div>

    <!-- Modales -->
    <CreateRoleModal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @created="fetchRoles"
    />
    <UpdateRolePermissionModal
      v-if="selectedRole"
      :role="selectedRole"
      @close="selectedRole = null"
      @updated="fetchRoles"
    />
    <ConfirmationModal
      v-if="isConfirmModalOpen"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>

<script lang="ts">
import RoleTable from '@/components/RoleTable.vue'
import CreateRoleModal from '@/components/CreateRoleModal.vue'
import UpdateRolePermissionModal from '@/components/UpdateRolePermissionModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { ref, onMounted } from 'vue'
import {
  fetchRolesWithPermissions,
  deleteRole,
  removePermission,
  removeUserFromRole,
} from '@/services/RoleService'
import type {
  Role,
  DeleteType,
  ConfirmData,
  PermissionData,
  UserData,
  RoleData,
} from '@/types/RoleTypes'

export default {
  name: 'ListRolesWithPermissions',
  components: {
    RoleTable,
    CreateRoleModal,
    UpdateRolePermissionModal,
    ConfirmationModal,
  },
  setup() {
    const roles = ref<Role[]>([])
    const selectedRole = ref<Role | null>(null)
    const isCreateModalOpen = ref(false)
    const isConfirmModalOpen = ref(false)
    const confirmMessage = ref('')
    const confirmAction = ref(() => {})
    const errorMessage = ref('')

    const fetchRoles = async () => {
      try {
        roles.value = await fetchRolesWithPermissions()
      } catch {
        errorMessage.value = 'Error al cargar roles y permisos.'
      }
    }

    const confirmDelete = (type: DeleteType, data: ConfirmData): void => {
      switch (type) {
        case 'permission':
          confirmMessage.value = `¿Estás seguro de eliminar el permiso "${(data as PermissionData).permission}"?`
          confirmAction.value = () =>
            removePermission((data as PermissionData).roleId, (data as PermissionData).permission)
          break
        case 'user':
          confirmMessage.value = `¿Estás seguro de eliminar al usuario del rol?`
          confirmAction.value = () =>
            removeUserFromRole((data as UserData).roleId, (data as UserData).userId)
          break
        case 'role':
          confirmMessage.value = `¿Estás seguro de eliminar el rol?`
          confirmAction.value = () => deleteRole((data as RoleData).roleId)
          break
        default:
          confirmMessage.value = 'Acción desconocida.'
          confirmAction.value = () => {}
      }
      isConfirmModalOpen.value = true
    }

    const handleConfirm = async () => {
      await confirmAction.value()
      isConfirmModalOpen.value = false
      await fetchRoles()
    }

    const selectRoleForUpdate = (role: Role): void => {
      selectedRole.value = role
    }

    onMounted(() => {
      fetchRoles()
    })

    return {
      roles,
      selectedRole,
      isCreateModalOpen,
      isConfirmModalOpen,
      confirmMessage,
      errorMessage,
      fetchRoles,
      confirmDelete,
      handleConfirm,
      selectRoleForUpdate,
    }
  },
}
</script>
