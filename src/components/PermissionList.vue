<template>
  <ul>
    <li
      v-for="permission in permissions"
      :key="permission"
      class="flex justify-between items-center"
    >
      {{ permission }}
      <button
        class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2 my-2"
        @click="$emit('remove', permission)"
      >
        Eliminar
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
export default {
  name: 'PermissionList',
  props: {
    permissions: {
      type: Array as () => string[],
      required: true,
    },
    roleId: {
      type: Number,
      required: true,
    },
  },
}
</script>
