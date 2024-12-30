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
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="role in roles"
            :key="role.id"
            class="even:bg-gray-100 hover:bg-blue-100 transition-colors"
          >
            <td class="py-2 px-4">{{ role.name }}</td>
            <td class="py-2 px-4">
              <ul>
                <li v-for="permission in role.permissions" :key="permission">
                  {{ permission }}
                </li>
              </ul>
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

interface Role {
  id: number
  name: string
  permissions: string[]
}

export default {
  name: 'ListRolesWithPermissions',
  components: {
    CreateRolePermissionButton,
  },
  setup() {
    const roles = ref<Role[]>([])
    const errorMessage = ref<string | null>(null)

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

    onMounted(() => {
      fetchRolesWithPermissions()
    })

    return {
      roles,
      errorMessage,
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
