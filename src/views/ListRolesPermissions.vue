<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-4xl bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Roles y Permisos</h1>
      <CreateRolePermissionButton />
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
                    class="ml-2 text-red-500 hover:text-red-700"
                    @click="removePermission(role.id, permission)"
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
                    class="ml-2 text-red-500 hover:text-red-700"
                    @click="removeUserFromRole(role.id, user.id)"
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
                @click="updateRole(role.id)"
              >
                Actualizar
              </button>
              <button
                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                @click="deleteRole(role.id)"
              >
                Eliminar
              </button>
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
  </div>
</template>

<script lang="ts">
import CreateRolePermissionButton from '@/components/CreateRolePermissionButton.vue'
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
    CreateRolePermissionButton,
  },
  setup() {
    const roles = ref<Role[]>([])
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

    // Update role
    const updateRole = async (roleId: number) => {
      try {
        // Simulate a modal or form submission with updated role data
        const updatedRoleName = prompt('Ingrese el nuevo nombre del rol:')
        if (!updatedRoleName) return

        const response = await axios.put(`/roles-permissions/roles/${roleId}`, {
          role_name: updatedRoleName,
          permissions: [], // Puedes incluir permisos actualizados aquí
        })
        console.log(response.data.message)
        await fetchRolesWithPermissions() // Recargar la lista de roles
      } catch (error) {
        console.error('Error actualizando el rol:', error)
      }
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
        const confirmRemoval = confirm(
          `¿Estás seguro de que deseas eliminar el permiso "${permission}" del rol?`,
        )
        if (!confirmRemoval) return

        // Realiza la solicitud al backend para eliminar el permiso del rol
        const response = await axios.delete(`/roles-permissions/roles/${roleId}/permissions`, {
          data: { permission }, // Envía el permiso a eliminar en el cuerpo de la solicitud
        })

        console.log(response.data.message)
        alert(`Permiso "${permission}" eliminado del rol exitosamente.`)

        // Actualiza la lista de roles para reflejar los cambios
        await fetchRolesWithPermissions()
      } catch (error) {
        console.error('Error eliminando permiso:', error)
        alert('Ocurrió un error al intentar eliminar el permiso.')
      }
    }

    // Remove user from role
    const removeUserFromRole = async (roleId: number, userId: number) => {
      try {
        await axios.delete(`/roles-permissions/roles/${roleId}/users/${userId}`)
        await fetchRolesWithPermissions() // Recargar la lista de roles
      } catch (error) {
        console.error('Error eliminando usuario del rol:', error)
      }
    }

    onMounted(() => {
      fetchRolesWithPermissions()
    })

    return {
      roles,
      errorMessage,
      updateRole,
      deleteRole,
      removePermission,
      removeUserFromRole,
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
