<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Crear Rol o Permiso</h1>

      <form @submit.prevent="handleCreate" class="space-y-6">
        <!-- Tipo (Rol o Permiso) -->
        <div>
          <label for="type" class="block text-gray-700 font-medium mb-1">Tipo:</label>
          <select
            id="type"
            v-model="form.type"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="role">Rol</option>
            <option value="permission">Permiso</option>
          </select>
        </div>

        <!-- Nombre del Rol o Permiso -->
        <div>
          <label for="name" class="block text-gray-700 font-medium mb-1">Nombre:</label>
          <input
            id="name"
            v-model="form.name"
            required
            placeholder="Nombre del rol o permiso"
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Botón de creación -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Creando...' : 'Crear' }}
        </button>
      </form>

      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { AxiosError, isAxiosError } from 'axios'
import axios from '@/axiosConfig'

interface CreateForm {
  type: string
  name: string
}

export default {
  name: 'CreateRolePermission',
  setup() {
    const form = ref<CreateForm>({
      type: 'role', // Por defecto selecciona "Rol"
      name: '',
    })

    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)
    const successMessage = ref<string | null>(null)

    const handleCreate = async () => {
      isLoading.value = true
      errorMessage.value = null
      successMessage.value = null

      try {
        const endpoint =
          form.value.type === 'role'
            ? '/roles-permissions/roles' // Endpoint para roles
            : '/roles-permissions/permissions' // Endpoint para permisos

        await axios.post(endpoint, { name: form.value.name })
        successMessage.value = `¡${form.value.type === 'role' ? 'Rol' : 'Permiso'} creado exitosamente!`
        form.value.name = '' // Limpiar el campo de nombre
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (isAxiosError(axiosError) && axiosError.response) {
          const data = axiosError.response.data as { message?: string }
          errorMessage.value = data.message || 'Error al crear.'
        } else {
          errorMessage.value = 'Error al crear.'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      isLoading,
      errorMessage,
      successMessage,
      handleCreate,
    }
  },
}
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí */
</style>
