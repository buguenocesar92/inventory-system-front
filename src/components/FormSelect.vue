<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array as PropType<Array<{ id: number; name: string }>>,
    required: true,
    default: () => []
  },
  modelValue: {
    type: [String, Number, null] as PropType<string | number | null>,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  placeholderValue: {
    type: [String, Number],
    default: 0 // Cambiado a número para coincidir con IDs de categoría
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Inicializar con valor seguro (evitar null)
const selectedValue = ref(props.modelValue ?? props.placeholderValue);

// Actualizar cuando cambia el valor del padre
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue ?? props.placeholderValue;
  }
);

// Emitir cambios
watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <div class="form-select-container">
    <label :for="id" class="block font-medium mb-1">
      {{ label }}
<!--       <span v-if="required" class="text-red-500">*</span> -->
    </label>

    <select
      :id="id"
      v-model="selectedValue"
      class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      :class="{ 'border-red-500': error }"
      :required="required"
    >
      <option
        disabled
        :value="placeholderValue"
        class="text-gray-400"
      >
        {{ placeholder }}
      </option>

      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
        class="text-gray-800"
      >
        {{ option.name }}
      </option>
    </select>

    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>
