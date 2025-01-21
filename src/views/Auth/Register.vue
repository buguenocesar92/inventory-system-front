<!-- src/views/Auth/Register.vue -->
<script setup lang="ts">
import { ref, defineOptions } from 'vue';
import Swal from 'sweetalert2';
import FormInput from '@/components/FormInput.vue';
import { registerTenant } from '@/services/TenantService';
import { useFormValidation } from '@/composables/useFormValidation';
import type { RegisterTenantPayload } from '@/types/TenantTypes';

// (Opcional) Asigna un nombre al componente (útil para devtools/logs)
defineOptions({ name: 'RegisterTenant' });

// Estado reactivo
const form = ref<RegisterTenantPayload>({
  tenant_id: '',
  user_name: '',
  user_email: '',
  user_password: '',
});
const isLoading = ref(false);
const loginUrl = ref<string | null>(null);

// Composables para validación
const { errors, handleValidationError } = useFormValidation();

/**
 * Maneja el evento de registro de Tenant.
 */
async function handleRegister() {
  isLoading.value = true;

  try {
    const { frontend_url } = await registerTenant(form.value);
    loginUrl.value = `${frontend_url.toLowerCase()}/login`;

    // Mostrar notificación con enlace
    await Swal.fire({
      icon: 'success',
      title: 'Registration Successful',
      html: `
        <p>Your tenant has been registered successfully. You can log in at:</p>
        <a href="${loginUrl.value}" class="text-blue-500 underline" target="_blank">
          ${loginUrl.value}
        </a>
      `,
      confirmButtonText: 'OK',
    });
  } catch (error) {
    handleValidationError(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
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
          :error="errors.tenant_id?.[0]"
          required
        />

        <!-- Campo Admin Name -->
        <FormInput
          id="user_name"
          label="Admin Name"
          v-model="form.user_name"
          :error="errors.user_name?.[0]"
          required
        />

        <!-- Campo Admin Email -->
        <FormInput
          id="user_email"
          label="Admin Email"
          v-model="form.user_email"
          :error="errors.user_email?.[0]"
          type="email"
          required
        />

        <!-- Campo Password -->
        <FormInput
          id="user_password"
          label="Password"
          v-model="form.user_password"
          :error="errors.user_password?.[0]"
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
    </div>
  </div>
</template>
