<template>
  <!-- Contenedor principal, centrado en pantalla con fondo -->
  <div class="flex flex-col items-center justify-center py-20">
    <!-- Tarjeta / formulario -->
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Campo Name -->
        <div>
          <label for="name" class="block text-gray-700 font-medium mb-1"> Name: </label>
          <input
            id="name"
            v-model="form.name"
            required
            class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
import { AxiosError, isAxiosError } from 'axios'

interface RegisterForm {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export default {
  name: 'UserRegister',
  setup() {
    const router = useRouter()

    const form = ref<RegisterForm>({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    })

    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null

      try {
        // Enviamos todos los campos que el backend espera
        await axios.post('/register', form.value)
        alert('Registro exitoso, ahora inicia sesión.')
        router.push('/login')
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

<style scoped>
/* Aquí puedes sobrescribir o añadir detalles extra */
.register {
  /* Por si quieres un ancho máximo distinto, etc. */
  max-width: 300px;
  margin: 0 auto;
}
</style>
