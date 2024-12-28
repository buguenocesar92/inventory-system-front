<template>
  <button @click="handleLogout">Logout</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LogoutButton',
  setup() {
    const router = useRouter()

    const handleLogout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }

    return { handleLogout }
  },
})
</script>
