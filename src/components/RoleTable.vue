<template>
  <table class="min-w-full border border-gray-300">
    <thead>
      <tr class="bg-blue-500 text-white">
        <th class="py-2 px-4 text-left">Rol</th>
        <th class="py-2 px-4 text-left">Permisos</th>
        <th class="py-2 px-4 text-left">Usuarios</th>
        <th class="py-2 px-4 text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="role in roles"
        :key="role.id"
        class="even:bg-gray-100 hover:bg-blue-100 transition-colors"
      >
        <td class="py-2 px-4">{{ role.name }}</td>
        <td class="py-2 px-4">
          <PermissionList
            :permissions="role.permissions"
            :role-id="role.id"
            @remove="
              (permission) => $emit('confirmDelete', 'permission', { roleId: role.id, permission })
            "
          />
        </td>
        <td class="py-2 px-4">
          <UserList
            :users="role.users"
            :role-id="role.id"
            @remove="(userId) => $emit('confirmDelete', 'user', { roleId: role.id, userId })"
          />
        </td>
        <td class="py-2 px-4 text-center">
          <button
            class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            @click="$emit('update', role)"
          >
            Actualizar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import PermissionList from '@/components/PermissionList.vue'
import UserList from '@/components/UserList.vue'

interface Role {
  id: number
  name: string
  permissions: string[]
  users: {
    id: number
    name: string
    email: string
  }[]
}

export default {
  name: 'RoleTable',
  components: { PermissionList, UserList },
  props: {
    roles: {
      type: Array as () => Role[],
      required: true,
    },
  },
}
</script>
