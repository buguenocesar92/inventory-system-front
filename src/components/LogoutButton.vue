<template>
  <button @click="handleLogout">Logout</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { logoutUser } from '@/services/AuthService'

export default defineComponent({
  name: 'LogoutButton',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
      try {
        // Llama al backend para cerrar sesión
        await logoutUser()

        // Limpia el estado del usuario en el store
        authStore.logout()

        // Redirige al usuario al login
        router.push('/login')
      } catch (error) {
        console.error('Error during logout:', error)
        alert('Failed to log out. Please try again.')
      }
    }

    return { handleLogout }
  },
})
</script>
