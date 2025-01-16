<template>
  <div>
    <h1>Mensajes en tiempo real</h1>
    <ul>
      <li v-for="(mensaje, index) in mensajes" :key="index">{{ mensaje }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import echo from '@/echo'; // Asegúrate de que esta ruta sea correcta

export default defineComponent({
  name: 'RealTimeMessages',
  setup() {
    const mensajes = ref<string[]>([]);

    const escucharEventos = () => {
      echo.channel('nombre-del-canal')
        .listen('.NombreDelEvento', (data: { message: string; userId: number }) => {
          mensajes.value.push(data.message); // Agrega el mensaje al array
          console.log('Evento recibido:', data);
        });
    };

    onMounted(() => {
      escucharEventos();
    });

    onUnmounted(() => {
      echo.leaveChannel('nombre-del-canal'); // Limpia la suscripción al canal
    });

    return {
      mensajes,
    };
  },
});
</script>

<style scoped>
/* Puedes añadir estilos aquí si es necesario */
</style>
