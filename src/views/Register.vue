<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Campo Tenant Name -->
        <div>
          <label for="tenant_id" class="block text-gray-700 font-medium mb-1">Name:</label>
          <input
            id="tenant_id"
            v-model="form.tenant_id"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.tenant_id" class="text-red-500 text-sm">
            {{ errors.tenant_id[0] }}
          </p>
        </div>

        <!-- Campo Admin Name -->
        <div>
          <label for="user_name" class="block text-gray-700 font-medium mb-1">Admin Name:</label>
          <input
            id="user_name"
            v-model="form.user_name"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.user_name" class="text-red-500 text-sm">{{ errors.user_name[0] }}</p>
        </div>

        <!-- Campo Admin Email -->
        <div>
          <label for="user_email" class="block text-gray-700 font-medium mb-1">Admin Email:</label>
          <input
            id="user_email"
            type="email"
            v-model="form.user_email"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.user_email" class="text-red-500 text-sm">{{ errors.user_email[0] }}</p>
        </div>

        <!-- Campo Password -->
        <div>
          <label for="user_password" class="block text-gray-700 font-medium mb-1">Password:</label>
          <input
            id="user_password"
            type="password"
            v-model="form.user_password"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.user_password" class="text-red-500 text-sm">
            {{ errors.user_password[0] }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Registration Successful</h2>
        <p class="mb-4">
          Your tenant has been registered. You can log in at:
          <a :href="loginUrl || '#'" class="text-blue-500 underline">{{ loginUrl }}</a>
        </p>
        <button
          @click="handleCloseModal"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { registerTenant } from '@/services/TenantService'
import type { RegisterTenantPayload } from '@/types/TenantTypes'

export default {
  name: 'RegisterTenant',
  setup() {
    const form = ref<RegisterTenantPayload>({
      tenant_id: '',
      user_name: '',
      user_email: '',
      user_password: '',
    })

    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    // Controlar errores específicos para cada campo
    const errors = ref<{ [key: string]: string[] }>({})

    // Controlar el modal
    const showModal = ref(false)
    const loginUrl = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null
      errors.value = {}

      try {
        const { frontend_url } = await registerTenant(form.value)
        loginUrl.value = (frontend_url + '/login').toLowerCase()
        showModal.value = true
      } catch (error) {
        if (!axios.isAxiosError(error)) {
          errorMessage.value = 'An unexpected error occurred.'
          return
        }

        const { response } = error as AxiosError
        if (response?.status === 400) {
          errors.value = response.data as { [key: string]: string[] }
          return
        }

        errorMessage.value = 'Unexpected error occurred. Please try again later.'
      } finally {
        isLoading.value = false
      }
    }

    const handleCloseModal = () => {
      showModal.value = false
      resetForm()
    }

    const resetForm = () => {
      form.value = {
        tenant_id: '',
        user_name: '',
        user_email: '',
        user_password: '',
      }
    }

    return {
      form,
      isLoading,
      errorMessage,
      errors,
      showModal,
      loginUrl,
      handleRegister,
      handleCloseModal,
    }
  },
}
</script>
