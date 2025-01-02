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
      <!-- Tabla -->
      <table class="min-w-full border border-gray-300">
        <thead>
          <tr class="bg-blue-500 text-white">
            <th class="py-2 px-4 text-left">Rol</th>
            <th class="py-2 px-4 text-left">Permisos</th>
            <th class="py-2 px-4 text-left">Usuarios</th>
            <th class="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="role in roles"
            :key="role.id"
            class="even:bg-gray-100 hover:bg-blue-100 transition-colors"
          >
            <!-- Rol -->
            <td class="py-2 px-4">{{ role.name }}</td>
            <!-- Permisos -->
            <td class="py-2 px-4">
              <ul>
                <li
                  v-for="permission in role.permissions"
                  :key="permission"
                  class="flex justify-between items-center"
                >
                  {{ permission }}
                  <button
                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2 my-2"
                    @click="confirmDelete('permission', { roleId: role.id, permission })"
                  >
                    Eliminar
                  </button>
                </li>
              </ul>
            </td>
            <!-- Usuarios -->
            <td class="py-2 px-4">
              <ul>
                <li
                  v-for="user in role.users"
                  :key="user.id"
                  class="flex justify-between items-center"
                >
                  {{ user.name }} ({{ user.email }})
                  <button
                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2 my-2"
                    @click="confirmDelete('user', { roleId: role.id, userId: user.id })"
                  >
                    Eliminar
                  </button>
                </li>
              </ul>
            </td>
            <!-- Acciones -->
            <td class="py-2 px-4 text-center">
              <button
                class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                @click="selectRoleForUpdate(role)"
              >
                Actualizar
              </button>
              <!--               <button
                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                @click="confirmDelete('role', { roleId: role.id })"
              >
                Eliminar
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensaje si no hay datos -->
      <p v-if="roles.length === 0" class="text-gray-500 mt-4 text-center">
        No hay roles ni permisos para mostrar.
      </p>

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
    </div>

    <!-- Modal de Creación -->
    <CreateRoleModal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @created="fetchRolesWithPermissions"
    />

    <!-- Modal de Actualización -->
    <UpdateRolePermissionModal
      v-if="selectedRole"
      :role="selectedRole"
      @close="selectedRole = null"
      @updated="fetchRolesWithPermissions"
    />

    <!-- Modal de Confirmación -->
    <ConfirmationModal
      v-if="isConfirmModalOpen"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>

<script lang="ts">
import CreateRoleModal from '@/components/CreateRoleModal.vue'
import UpdateRolePermissionModal from '@/components/UpdateRolePermissionModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { ref, onMounted } from 'vue'
import axios from '@/axiosConfig'
import { AxiosError, isAxiosError } from 'axios'

interface User {
  id: number
  name: string
  email: string
}

interface Role {
  id: number
  name: string
  permissions: string[]
  users: User[]
}

export default {
  name: 'ListRolesWithPermissions',
  components: {
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
    const confirmAction = ref<() => void>(() => {})

    const errorMessage = ref<string | null>(null)

    // Fetch roles and permissions
    const fetchRolesWithPermissions = async () => {
      errorMessage.value = null
      try {
        const response = await axios.get('/roles-permissions/roles-with-permissions')
        roles.value = response.data
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (isAxiosError(axiosError) && axiosError.response) {
          const data = axiosError.response.data as { message?: string }
          errorMessage.value = data.message || 'Error al cargar roles y permisos.'
        } else {
          errorMessage.value = 'Error al cargar roles y permisos.'
        }
      }
    }

    // Confirmation logic
    interface PermissionData {
      roleId: number
      permission: string
    }

    interface UserData {
      roleId: number
      userId: number
    }

    interface RoleData {
      roleId: number
    }

    type ConfirmData = PermissionData | UserData | RoleData

    const confirmDelete = (type: string, data: ConfirmData) => {
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
          confirmAction.value = () => deleteRole(data.roleId)
          break
        default:
          confirmMessage.value = 'Acción desconocida.'
          confirmAction.value = () => {}
      }
      isConfirmModalOpen.value = true
    }

    const handleConfirm = () => {
      confirmAction.value()
      isConfirmModalOpen.value = false
    }

    // Select role for updating
    const selectRoleForUpdate = (role: Role) => {
      selectedRole.value = role
    }

    // Delete role
    const deleteRole = async (roleId: number) => {
      try {
        await axios.delete(`/roles-permissions/roles/${roleId}`)
        roles.value = roles.value.filter((role) => role.id !== roleId)
      } catch (error) {
        console.error('Error eliminando rol:', error)
      }
    }

    // Remove permission from a role
    const removePermission = async (roleId: number, permission: string) => {
      try {
        const response = await axios.delete(`/roles-permissions/roles/${roleId}/permissions`, {
          data: { permission },
        })
        console.log(response.data.message)
        await fetchRolesWithPermissions()
      } catch (error) {
        console.error('Error eliminando permiso:', error)
      }
    }

    // Remove user from role
    const removeUserFromRole = async (roleId: number, userId: number) => {
      try {
        await axios.delete(`/roles-permissions/roles/${roleId}/users/${userId}`)
        await fetchRolesWithPermissions()
      } catch (error) {
        console.error('Error eliminando usuario del rol:', error)
      }
    }

    onMounted(() => {
      fetchRolesWithPermissions()
    })

    return {
      roles,
      selectedRole,
      isCreateModalOpen,
      isConfirmModalOpen,
      confirmMessage,
      fetchRolesWithPermissions,
      confirmDelete,
      handleConfirm,
      selectRoleForUpdate,
    }
  },
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
