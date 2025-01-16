<template>
  <div>
    <h1>Mensajes en tiempo real</h1>
    <ul>
      <li v-for="(mensaje, index) in mensajes" :key="index">{{ mensaje }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import echo from '@/echo';

export default defineComponent({
  name: 'RealTimeMessages',
  setup() {
    const mensajes = ref<string[]>([]);

    onMounted(() => {
      echo.private(`user.${1}`) // Sustituye 1 por el ID real del usuario autenticado
        .listen('NombreDelEvento', (data: { message: string }) => {
          mensajes.value.push(data.message);
        });
    });

    return { mensajes };
  },
});
</script>
