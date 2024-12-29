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
            v-model="form.name"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Campo Domain -->
        <div>
          <label for="domain" class="block text-gray-700 font-medium mb-1">Domain:</label>
          <input
            id="domain"
            v-model="form.domain"
            required
            placeholder="e.g., acme.local"
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
            v-model="form.password"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Campo Confirm Password -->
        <div>
          <label for="password_confirmation" class="block text-gray-700 font-medium mb-1">
            Confirm Password:
          </label>
          <input
            id="password_confirmation"
            type="password"
            v-model="form.password_confirmation"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Botón de registro -->
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
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError, isAxiosError } from 'axios'
import axios from '@/axiosConfig'

interface RegisterForm {
  name: string
  domain: string
  user_name: string
  user_email: string
  password: string
  password_confirmation: string
}

export default {
  name: 'RegisterTenant',
  setup() {
    const router = useRouter()
    const form = ref<RegisterForm>({
      name: '',
      domain: '',
      user_name: '',
      user_email: '',
      password: '',
      password_confirmation: '',
    })

    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null

      try {
        const response = await axios.post('/register-tenant', form.value)
        localStorage.setItem('access_token', response.data.access_token)
        router.push('/dashboard')
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (isAxiosError(axiosError) && axiosError.response) {
          // Asumiendo que el backend devuelve un objeto con propiedad "message"
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
      handleRegister,
    }
  },
}
</script>
