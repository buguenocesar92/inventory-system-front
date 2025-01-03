// authStore.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    accessToken: '',
  }),
  actions: {
    /** Verifica si el usuario está autenticado */
    checkAuth() {
      const token = localStorage.getItem('access_token')
      this.isAuthenticated = !!token
      this.accessToken = token || ''
    },
    /** Inicia sesión y guarda el token */
    login(token: string) {
      localStorage.setItem('access_token', token)
      this.accessToken = token
      this.isAuthenticated = true
    },
    /** Cierra sesión */
    logout() {
      localStorage.removeItem('access_token')
      this.accessToken = ''
      this.isAuthenticated = false
    },
  },
})
