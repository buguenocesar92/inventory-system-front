<template>
  <!-- Contenedor principal del login -->
  <div class="flex flex-col items-center justify-center py-20">
    <!-- Tarjeta / formulario centrado -->
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Campo Email -->
        <div>
          <label for="email" class="block text-gray-700 font-medium mb-1"> Email: </label>
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
          <label for="password" class="block text-gray-700 font-medium mb-1"> Password: </label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>

      <!-- Enlace a registro -->
      <p class="mt-4 text-center">
        ¿No tienes cuenta?
        <router-link to="/register" class="text-blue-600 hover:underline"
          >Regístrate aquí</router-link
        >.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError, isAxiosError } from 'axios'
import axiosInstance from '@/axiosConfig'

interface LoginForm {
  email: string
  password: string
}

export default {
  name: 'UserLogin',
  setup() {
    const router = useRouter()

    const form = ref<LoginForm>({ email: '', password: '' })
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    const handleLogin = async () => {
      isLoading.value = true
      errorMessage.value = null

      try {
        // Ajusta la URL o usa tu instancia de Axios con baseURL
        const response = await axiosInstance.post('/login', form.value)
        localStorage.setItem('access_token', response.data.access_token)
        router.push('/dashboard')
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (isAxiosError(axiosError) && axiosError.response) {
          errorMessage.value =
            (axiosError.response.data as { message: string }).message || 'Login failed.'
        } else {
          errorMessage.value = 'Login failed.'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      isLoading,
      errorMessage,
      handleLogin,
    }
  },
}
</script>

<!--
  No es obligatorio definir estilos locales si ya utilizas Tailwind
  para todo, pero si deseas añadir algún estilo puntual, puedes hacerlo.
-->
<style scoped>
/* Ejemplo: Ajustes específicos o animaciones extra */
</style>
