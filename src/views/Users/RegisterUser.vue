<!-- src/views/RegisterUser.vue -->
<script setup lang="ts">
import { ref, defineOptions } from 'vue';
import FormInput from '@/components/FormInput.vue';
import { registerUser } from '@/services/UserService';
import { useFormValidation } from '@/composables/useFormValidation';
import { useNotification } from '@/composables/useNotification';
import type { RegisterUser } from '@/types/UserTypes';
import AdminWrapper from '@/components/AdminWrapper.vue';

// (Opcional) Asigna un nombre interno al componente para devtools/debugging
defineOptions({ name: 'RegisterUser' });

// Estado del formulario
const form = ref<RegisterUser>({
  name: '',
  email: '',
  password: '',
});

const isLoading = ref(false);

// Composables
const { errors, handleValidationError } = useFormValidation();
const { showSuccessNotification } = useNotification();

/**
 * Maneja el evento de registro de usuario
 */
async function handleRegister() {
  isLoading.value = true;
  try {
    await registerUser(form.value);

    // Notificación de éxito
    await showSuccessNotification(
      'Usuario registrado',
      'El usuario ha sido registrado con éxito.'
    );

    resetForm();
  } catch (error) {
    handleValidationError(error);
  } finally {
    isLoading.value = false;
  }
}

/**
 * Reinicia el formulario
 */
function resetForm() {
  form.value = { name: '', email: '', password: '' };
}
</script>
<template>
  <AdminWrapper>
    <div class="flex flex-col items-center justify-center py-20">
      <div class="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
        <h1 class="text-2xl font-bold mb-4 text-center">Registrar Usuario</h1>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Campo Nombre -->
          <FormInput
            id="name"
            label="Nombre"
            placeholder="Ingrese su nombre"
            v-model="form.name"
            :error="errors.name?.[0]"
            required
          />

          <!-- Campo Correo Electrónico -->
          <FormInput
            id="email"
            label="Correo Electrónico"
            placeholder="Ingrese su correo electrónico"
            v-model="form.email"
            :error="errors.email?.[0]"
            type="email"
            required
          />

          <!-- Campo Contraseña -->
          <FormInput
            id="password"
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            v-model="form.password"
            :error="errors.password?.[0]"
            type="password"
            required
          />

          <!-- Botón de registro -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {{ isLoading ? 'Registrando...' : 'Registrar' }}
          </button>
        </form>
      </div>
    </div>
  </AdminWrapper>
</template>
