<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register User</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Campo Name -->
        <FormInput id="name" label="Name" v-model="form.name" required />

        <!-- Campo Email -->
        <FormInput id="email" label="Email" v-model="form.email" type="email" required />

        <!-- Campo Password -->
        <FormInput
          id="password"
          label="Password"
          v-model="form.password"
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

      <p v-if="errorMessage" class="text-red-500 mt-2 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
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
    const errorMessage = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null

      try {
        await registerUser(form.value)
        alert('User registered successfully.')
        resetForm()
      } catch (error) {
        console.error('Error registering user:', error)
        errorMessage.value = 'An error occurred while registering the user. Please try again.'
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
