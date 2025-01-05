<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register Tenant</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Campo Tenant Name -->
        <div>
          <label for="name" class="block text-gray-700 font-medium mb-1">Tenant Name:</label>
          <input
            id="name"
            v-model="form.tenant_id"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
        </div>

        <!-- Campo Password -->
        <div>
          <label for="password" class="block text-gray-700 font-medium mb-1">Password:</label>
          <input
            id="password"
            type="password"
            v-model="form.user_password"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          <a :href="loginUrl" class="text-blue-500 underline">{{ loginUrl }}</a>
        </p>
        <button
          @click="showModal = false"
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
import { AxiosError, isAxiosError } from 'axios'
import axios from '@/axiosConfig'

interface RegisterForm {
  tenant_id: string
  user_name: string
  user_email: string
  user_password: string
}

export default {
  name: 'RegisterTenant',
  setup() {
    const form = ref<RegisterForm>({
      tenant_id: '',
      user_name: '',
      user_email: '',
      user_password: '',
    })

    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    // Controlar el modal
    const showModal = ref(false)
    const loginUrl = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null

      try {
        const response = await axios.post('tenants/register', form.value)

        // Mostrar la URL en el modal
        loginUrl.value = response.data.frontend_url
        showModal.value = true
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (isAxiosError(axiosError) && axiosError.response) {
          const data = axiosError.response.data as { message?: string }
          errorMessage.value = data.message || 'Registration failed.'
        } else {
          errorMessage.value = 'Registration failed.'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      isLoading,
      errorMessage,
      showModal,
      loginUrl,
      handleRegister,
    }
  },
}
</script>
