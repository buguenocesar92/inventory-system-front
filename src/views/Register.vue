<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Register</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Campo Tenant Name -->
        <FormInput
          id="tenant_id"
          label="Tenant Name"
          v-model="form.tenant_id"
          :error="errors.tenant_id ? errors.tenant_id[0] : undefined"
          required
        />

        <!-- Campo Admin Name -->
        <FormInput
          id="user_name"
          label="Admin Name"
          v-model="form.user_name"
          :error="errors.user_name ? errors.user_name[0] : undefined"
          required
        />

        <!-- Campo Admin Email -->
        <FormInput
          id="user_email"
          label="Admin Email"
          v-model="form.user_email"
          :error="errors.user_email ? errors.user_email[0] : undefined"
          type="email"
          required
        />

        <!-- Campo Password -->
        <FormInput
          id="user_password"
          label="Password"
          v-model="form.user_password"
          :error="errors.user_password ? errors.user_password[0] : undefined"
          type="password"
          required
        />

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
import FormInput from '@/components/FormInput.vue'
import type { RegisterTenantPayload } from '@/types/TenantTypes'

export default {
  name: 'RegisterTenant',
  components: { FormInput },
  setup() {
    const form = ref<RegisterTenantPayload>({
      tenant_id: '',
      user_name: '',
      user_email: '',
      user_password: '',
    })

    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)
    const errors = ref<{ [key: string]: string[] }>({})
    const showModal = ref(false)
    const loginUrl = ref<string | null>(null)

    const handleRegister = async () => {
      isLoading.value = true
      errorMessage.value = null
      errors.value = {}

      try {
        const { frontend_url } = await registerTenant(form.value)
        loginUrl.value = `${frontend_url.toLowerCase()}/login`
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
