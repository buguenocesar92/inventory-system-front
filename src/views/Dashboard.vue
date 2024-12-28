<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>¡Bienvenido(a) a tu panel!</p>

    <!-- Botón de Logout -->
    <LogoutButton />
  </div>
</template>

<script lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'

export default {
  name: 'UserDashboard',
  components: {
    LogoutButton,
  },
}
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 0 auto;
}
</style>
