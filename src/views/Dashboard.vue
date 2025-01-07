<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>¡Bienvenido(a) a tu panel!</p>
    <GoToRegisterButton />
  </div>
</template>

<script lang="ts">
import GoToRegisterButton from '@/components/GoToRegisterButton.vue'

export default {
  name: 'UserDashboard',
  components: {
    GoToRegisterButton,
  },
}
</script>
