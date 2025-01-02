<template>
  <ul>
    <li v-for="user in users" :key="user.id" class="flex justify-between items-center">
      {{ user.name }} ({{ user.email }})
      <button
        class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2 my-2"
        @click="$emit('remove', user.id)"
      >
        Eliminar
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
interface User {
  id: number
  name: string
  email: string
}

export default {
  name: 'UserList',
  props: {
    users: {
      type: Array as () => User[],
      required: true,
    },
    roleId: {
      type: Number,
      required: true,
    },
  },
}
</script>
