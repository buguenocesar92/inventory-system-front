<template>
  <!-- Contenedor principal del registro -->
  <div class="flex flex-col items-center justify-center py-20">
    <!-- Tarjeta / formulario -->
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
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
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>

      <!-- Enlace a iniciar sesión -->
      <p class="mt-4 text-center">
        ¿Ya tienes una cuenta?
        <router-link to="/login" class="text-blue-600 hover:underline"> Inicia sesión </router-link
        >.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axiosConfig'
import { isAxiosError } from 'axios'

interface RegisterForm {
  email: string
  password: string
}

export default {
  name: 'UserRegister',
  setup() {
    const router = useRouter()

    const form = ref<RegisterForm>({ email: '', password: '' })
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null

      try {
        // Si tu backend devuelve directamente el token tras registrarte:
        await axios.post('/register', form.value)
        // localStorage.setItem("token", response.data.token); // <- Usa si devuelven token
        alert('Registro exitoso, ahora inicia sesión.')
        router.push('/login')
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response) {
          errorMessage.value = error.response.data?.message || 'Registration failed.'
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

<style scoped>
/* Si deseas añadir estilos personalizados adicionales, hazlo aquí */
</style>
