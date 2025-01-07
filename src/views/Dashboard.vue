<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>¡Bienvenido(a) a tu panel!</p>

    <!-- Botón para ir al formulario de creación de usuarios -->
    <GoToRegisterButton />
  </div>
</template>

<script lang="ts">
import GoToRegisterButton from '@/components/GoToRegisterButton.vue'

export default {
  name: 'UserDashboard',
  components: {
    GoToRegisterButton, // Registra el nuevo componente
  },
}
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 0 auto;
}
</style>
