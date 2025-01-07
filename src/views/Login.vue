<template>
  <!-- Contenedor principal del login -->
  <div class="flex flex-col items-center justify-center py-20">
    <!-- Tarjeta / formulario centrado -->
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
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
          <!-- Mostrar errores de email -->
          <p v-if="errors.email" class="text-red-500 text-sm">
            {{ errors.email[0] }}
          </p>
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
          <!-- Mostrar errores de password -->
          <p v-if="errors.password" class="text-red-500 text-sm">
            {{ errors.password[0] }}
          </p>
        </div>

        <!-- Botón de Enviar -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>
      </form>

      <!-- Mensaje de error general -->
      <p v-if="errorMessage" class="text-red-500 mt-2 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { loginUser } from '@/services/AuthService'
import type { LoginPayload } from '@/types/AuthTypes'

export default {
  name: 'UserLogin',
  setup() {
    const router = useRouter()

    // Estado del formulario
    const form = ref<LoginPayload>({ email: '', password: '' })
    const isLoading = ref(false)

    // Manejo de errores
    const errors = ref<{ [key: string]: string[] }>({})
    const errorMessage = ref<string | null>(null)

    // Función para manejar el login
    const handleLogin = async () => {
      isLoading.value = true
      errors.value = {} // Resetear errores por campo
      errorMessage.value = null // Resetear mensaje general

      try {
        const { access_token } = await loginUser(form.value)
        localStorage.setItem('access_token', access_token)
        router.push('/dashboard')
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

    return {
      form,
      isLoading,
      errors,
      errorMessage,
      handleLogin,
    }
  },
}
</script>
