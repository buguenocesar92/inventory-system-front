<template>
  <div>
    <label :for="id" class="block text-gray-700 font-medium mb-1">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      @input="onInput"
      :type="type"
      :required="required"
      class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'FormInput',
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: [String, Number] as PropType<string | number>, required: true },
    error: { type: String },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  methods: {
    onInput(event: Event) {
      const target = event.target as HTMLInputElement | null
      if (target) {
        this.$emit('update:modelValue', target.value)
      }
    },
  },
})
</script>
