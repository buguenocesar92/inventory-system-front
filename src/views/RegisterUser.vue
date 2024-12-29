<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register User</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Campo Name -->
        <div>
          <label for="name" class="block text-gray-700 font-medium mb-1">Name:</label>
          <input
            id="name"
            v-model="form.name"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Campo Email -->
        <div>
          <label for="email" class="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
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
import axios from '@/axiosConfig'
import { AxiosError, isAxiosError } from 'axios'

interface RegisterForm {
  name: string
  email: string
  password: string
}

export default {
  name: 'RegisterUser',
  setup() {
    const router = useRouter()

    const form = ref<RegisterForm>({
      name: '',
      email: '',
      password: '',
    })

    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null

      try {
        await axios.post('/register', form.value)
        // Limpia el formulario
        alert('User registered successfully.')
        resetForm()
        //router.push('/login')
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

    const resetForm = () => {
      form.value = { name: '', email: '', password: '' }
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

<style scoped>
/* Personaliza estilos si lo necesitas */
</style>
