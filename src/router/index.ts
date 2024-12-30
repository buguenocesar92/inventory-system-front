import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import NotFound from '../views/NotFound.vue' // Componente para la página 404
import RegisterUser from '../views/RegisterUser.vue'
import ListRolesPermissions from '../views/ListRolesPermissions.vue'
import CreateRolePermission from '../views/CreateRolePermission.vue'

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
    path: '/create-role-permission',
    name: 'CreateRolePermission',
    component: CreateRolePermission,
    meta: { requiresAuth: true },
  },
  // Ruta explícita para 404
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  // Ruta de captura que redirige a /404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const access_token = localStorage.getItem('access_token')

  // Rutas protegidas
  if (to.meta.requiresAuth && !access_token) {
    return next('/login')
  }

  // Rutas de invitado
  if (to.meta.requiresGuest && access_token) {
    return next('/dashboard')
  }

  // Redirige a /404 si no encuentra la ruta
  if (!to.matched.length) {
    return next('/404')
  }

  next()
})

export default router
