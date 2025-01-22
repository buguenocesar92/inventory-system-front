<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Props y eventos
defineProps({
  items: Array,
  headers: Array,
});

defineEmits(['remove']);
</script>

<template>
  <v-data-table :headers="headers" :items="items" class="elevation-1" dense>
    <template #body="{ items }">
      <tr v-for="(item, index) in items" :key="index">
        <td class="border px-2 py-1">{{ item.barcode }}</td>
        <td class="border px-2 py-1">{{ item.name }}</td>
        <td class="border px-2 py-1 text-right">${{ item.unit_price.toFixed(2) }}</td>
        <td class="border px-2 py-1 text-right">
          <v-text-field
            v-model.number="item.quantity"
            type="number"
            min="1"
            class="w-16 text-right"
            dense
            hide-details
          ></v-text-field>
        </td>
        <td class="border px-2 py-1 text-right">${{ (item.unit_price * item.quantity).toFixed(2) }}</td>
        <td class="border px-2 py-1 text-center">
          <v-btn icon color="error" @click="$emit('remove', index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
