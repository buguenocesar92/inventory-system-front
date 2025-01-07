<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>¡Bienvenido(a) a tu panel!</p>

    <!-- Botón para ir al formulario de creación de usuarios -->
    <GoToRegisterButton />

    <!-- Botón de Logout -->
    <!-- <LogoutButton /> -->
  </div>
</template>

<script lang="ts">
/* import LogoutButton from '@/components/LogoutButton.vue' */
import GoToRegisterButton from '@/components/GoToRegisterButton.vue'

export default {
  name: 'UserDashboard',
  components: {
    /* LogoutButton, */
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
