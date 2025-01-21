<!-- src/views/Auth/Login.vue -->
<script setup lang="ts">
import { ref, defineOptions } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import FormInput from '@/components/FormInput.vue';
import type { LoginPayload } from '@/types/AuthTypes';

// Define un nombre interno para el componente (opcional, útil para devtools)
defineOptions({ name: 'UserLogin' });

// Hooks de Vue Router y Auth
const router = useRouter();
const authStore = useAuthStore();

// Estado del formulario
const form = ref<LoginPayload>({ email: '', password: '' });
const isLoading = ref(false);

// Composables de validación y notificaciones
const { errors, errorMessage, handleValidationError } = useFormValidation();
const { showErrorNotification } = useNotification();

/**
 * Maneja el envío del formulario de login
 */
async function handleLogin() {
  isLoading.value = true;
  errors.value = {};
  errorMessage.value = null;

  try {
    await authStore.login(form.value);
    // Redirige a dashboard si el login fue exitoso
    router.push('/dashboard');
  } catch (error) {
    // Manejo de errores y notificación
    handleValidationError(error);
    if (errorMessage.value) {
      await showErrorNotification('Error de Login', errorMessage.value);
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
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
          :error="errors.email?.[0]"
          required
        />

        <FormInput
          id="password"
          label="Password"
          v-model="form.password"
          type="password"
          :error="errors.password?.[0]"
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
