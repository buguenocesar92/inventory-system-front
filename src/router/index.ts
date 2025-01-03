import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // Importar el store de autenticación

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import NotFound from '../views/NotFound.vue' // Componente para la página 404
import RegisterUser from '../views/RegisterUser.vue'
import ListRolesPermissions from '../views/ListRolesPermissions.vue'

// Definición de rutas
const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/register-user',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/roles-permissions',
    name: 'ListRolesPermissions',
    component: ListRolesPermissions,
    meta: { requiresAuth: true },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

// Crear la instancia del router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Middleware de autenticación con Pinia
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Verificar autenticación al navegar
  authStore.checkAuth()

  // Rutas protegidas
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // Rutas de invitado
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard')
  }

  next()
})

export default router
