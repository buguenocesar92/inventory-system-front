<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <FormInput
          id="email"
          label="Email"
          v-model="form.email"
          type="email"
          :error="errors.email ? errors.email[0] : undefined"
          required
        />
        <FormInput
          id="password"
          label="Password"
          v-model="form.password"
          type="password"
          :error="errors.password ? errors.password[0] : undefined"
          required
        />
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500 mt-2 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Usar el store
import FormInput from '@/components/FormInput.vue';
import type { LoginPayload } from '@/types/AuthTypes';
import type { ValidationErrorResponse } from '@/types/ValidationErrorResponse';
import type { AxiosError } from 'axios';

export default {
  name: 'UserLogin',
  components: { FormInput },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const form = ref<LoginPayload>({ email: '', password: '' });
    const isLoading = ref(false);
    const errors = ref<{ [key: string]: string[] }>({});
    const errorMessage = ref<string | null>(null);

    const handleLogin = async () => {
      isLoading.value = true;
      errors.value = {};
      errorMessage.value = null;

      try {
        await authStore.login(form.value); // Usar el método del store
        router.push('/dashboard'); // Redirigir al dashboard
      } catch (error) {
        const axiosError = error as AxiosError<ValidationErrorResponse>;
        if (axiosError.response?.status === 422) {
          errors.value = axiosError.response.data.errors;
          errorMessage.value = axiosError.response.data.message || 'Validation error occurred.';
        } else {
          errorMessage.value = 'Unexpected error occurred. Please try again later.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      isLoading,
      errors,
      errorMessage,
      handleLogin,
    };
  },
};
</script>
