<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="w-full max-w-lg bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Crear Rol</h1>

      <form @submit.prevent="handleCreate" class="space-y-6">
        <!-- Nombre del Rol -->
        <div>
          <label for="role_name" class="block text-gray-700 font-medium mb-1"
            >Nombre del Rol:</label
          >
          <input
            id="role_name"
            v-model="form.role_name"
            required
            placeholder="Nombre del rol"
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Permisos -->
        <div>
          <label for="permissions" class="block text-gray-700 font-medium mb-1">Permisos:</label>
          <div
            v-for="(permission, index) in form.permissions"
            :key="index"
            class="flex items-center space-x-2 mb-2"
          >
            <input
              v-model="form.permissions[index]"
              placeholder="Nombre del permiso"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click.prevent="removePermission(index)"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
            >
              X
            </button>
          </div>
          <button
            @click.prevent="addPermission"
            class="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Añadir Permiso
          </button>
        </div>

        <!-- Usuarios -->
        <div>
          <label for="users" class="block text-gray-700 font-medium mb-1">Usuarios:</label>
          <select
            id="users"
            v-model="form.users"
            multiple
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
          </select>
        </div>

        <!-- Botones -->
        <div class="flex justify-between">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {{ isLoading ? 'Creando...' : 'Crear Rol' }}
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { createRole, fetchUsersByTenant } from '@/services/RoleService'
import type { CreateRoleForm, User } from '@/types/RoleTypes'

export default {
  name: 'CreateRoleModal',
  emits: ['close', 'created'],
  setup(_, { emit }) {
    const form = ref<CreateRoleForm>({
      role_name: '',
      permissions: [],
      users: [],
    })

    const users = ref<User[]>([])
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)
    const successMessage = ref<string | null>(null)

    const fetchUsers = async () => {
      try {
        users.value = await fetchUsersByTenant()
      } catch {
        console.error('Error al cargar los usuarios.')
      }
    }

    const addPermission = () => form.value.permissions.push('')

    const removePermission = (index: number) => form.value.permissions.splice(index, 1)

    const handleCreate = async () => {
      isLoading.value = true
      errorMessage.value = null
      successMessage.value = null

      try {
        await createRole(form.value)
        successMessage.value = '¡Rol creado exitosamente!'
        emit('created')
        emit('close')
      } catch {
        errorMessage.value = 'Error al crear el rol.'
      } finally {
        isLoading.value = false
      }
    }

    onMounted(fetchUsers)

    return {
      form,
      users,
      isLoading,
      errorMessage,
      successMessage,
      addPermission,
      removePermission,
      handleCreate,
    }
  },
}
</script>

<style scoped>
/* Estilos opcionales */
</style>
