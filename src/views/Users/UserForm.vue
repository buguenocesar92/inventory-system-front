<template>
  <AdminWrapper>
    <div class="container mx-auto p-6 max-w-md">
      <h2 class="text-2xl font-bold mb-6">{{ formTitle }}</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Campo para Nombre -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nombre</label>
          <input
            v-model="user.name"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">
            {{ errors.name[0] }}
          </p>
        </div>

        <!-- Campo para Email -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input
            v-model="user.email"
            type="email"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email[0] }}
          </p>
        </div>

        <!-- Campo para Contraseña -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Contraseña</label>
          <input
            v-model="user.password"
            type="password"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password[0] }}
          </p>
          <p v-if="isEditing" class="text-gray-500 text-sm mt-1">
            Dejar en blanco si no desea cambiar la contraseña.
          </p>
        </div>

        <!-- Campo para Locación usando FormSelect -->
        <div class="mb-4">
          <FormSelect
            v-model="user.location_id"
            id="location_id"
            label="Seleccionar Local"
            :options="locations"
            placeholder="Seleccione un local"
            :placeholderValue="0"
            required
          />
          <p v-if="errors.location_id" class="text-red-500 text-sm mt-1">
            {{ errors.location_id[0] }}
          </p>
        </div>

        <!-- Botón de envío -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Guardando...' : 'Guardar' }}
        </button>
      </form>
    </div>
  </AdminWrapper>
</template>

<script setup lang="ts">
import AdminWrapper from '@/components/AdminWrapper.vue';
import FormSelect from '@/components/FormSelect.vue';
import { useUserForm } from '@/composables/useUserForm';

const { user, isEditing, isLoading, errors, formTitle, handleSubmit, locations } =
  useUserForm();
</script>
