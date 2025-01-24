<script setup lang="ts">
import { ref, watch } from 'vue';

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
    type: Array as () => Array<{ id: number; name: string }>,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  placeholderValue: {
    type: [String, Number],
    default: '0',
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

// Inicializa selectedValue con el valor de modelValue
const selectedValue = ref(props.modelValue);

// Watch para actualizar selectedValue cuando modelValue cambie desde el padre
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  }
);

// Watch para emitir el nuevo valor cuando selectedValue cambie
watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
<template>
  <div>
    <label :for="id" class="block font-medium">
      {{ label }}
    </label>
    <select
      :id="id"
      v-model="selectedValue"
      class="border rounded px-3 py-2 w-full"
      :required="required"
    >
      <option disabled :value="placeholderValue">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
      >
        {{ option.name }}
      </option>
    </select>
    <p v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </p>
  </div>
</template>
