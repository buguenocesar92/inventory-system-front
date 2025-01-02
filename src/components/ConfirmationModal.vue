<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-md max-w-md w-full">
      <p class="text-center text-lg font-semibold">{{ message }}</p>
      <div class="mt-6 flex justify-around">
        <button
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          @click="$emit('confirm')"
        >
          Confirmar
        </button>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
/* Opcional: estilos personalizados para el modal */
</style>
