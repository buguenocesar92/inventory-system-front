<template>
  <button @click="handleLogout">Logout</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LogoutButton',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
      authStore.logout()
      router.push('/login') // Maneja la redirección aquí
    }

    return { handleLogout }
  },
})
</script>
