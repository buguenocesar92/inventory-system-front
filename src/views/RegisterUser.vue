<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register User</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Campo Name -->
        <FormInput
          id="name"
          label="Name"
          v-model="form.name"
          :error="errors.name ? errors.name[0] : undefined"
          required
        />

        <!-- Campo Email -->
        <FormInput
          id="email"
          label="Email"
          v-model="form.email"
          :error="errors.email ? errors.email[0] : undefined"
          type="email"
          required
        />

        <!-- Campo Password -->
        <FormInput
          id="password"
          label="Password"
          v-model="form.password"
          :error="errors.password ? errors.password[0] : undefined"
          type="password"
          required
        />

        <!-- Botón de registro -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <!-- Mensaje de error general -->
      <p v-if="errorMessage" class="text-red-500 mt-2 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import FormInput from '@/components/FormInput.vue'
import { registerUser } from '@/services/UserService'
import type { RegisterUser } from '@/types/UserTypes'

export default {
  name: 'RegisterUser',
  components: { FormInput },
  setup() {
    const form = ref<RegisterUser>({
      name: '',
      email: '',
      password: '',
    })

    const isLoading = ref(false)
    const errors = ref<{ [key: string]: string[] }>({})
    const errorMessage = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null
      errors.value = {} // Resetear errores por campo

      try {
        await registerUser(form.value)
        alert('User registered successfully.')
        resetForm()
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

    const resetForm = () => {
      form.value = { name: '', email: '', password: '' }
    }

    return {
      form,
      isLoading,
      errors,
      errorMessage,
      handleRegister,
    }
  },
}
</script>
