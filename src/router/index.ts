import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { isSubdomain } from '@/utils/domainUtils'; // Importar lógica de subdominio

// Importaciones de vistas
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import NotFound from '../views/NotFound.vue';
import RegisterUser from '../views/RegisterUser.vue';
import AddProduct from '../views/Products/AddProduct.vue';
import ProductList from '../views/Products/ProductList.vue';
import EditProduct from '../views/Products/EditProduct.vue';
import MovementForm from '../views/Inventory/MovementForm.vue';
import POS from '../views/Sales/POS.vue';
import AccessDenied from '../views/AccessDenied.vue';
/* import RealTimeMessages from '../views/RealTimeMessages.vue';
 */
const routes = [
  {
    path: '/',
    redirect: () => (isSubdomain() ? '/dashboard' : '/register'),
  },
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
    meta: { requiresAuth: true, permissions: [] }, // Permite a todos los autenticados
  },
  {
    path: '/register-user',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true, permissions: ['products.store'] },
  },
  {
    path: '/edit-product/:id',
    name: 'EditProduct',
    component: EditProduct,
    meta: { requiresAuth: true, permissions: ['products.update'] },
    props: true,
  },
  {
    path: '/list-product',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true, permissions: ['products.index'] },
  },
  {
    path: '/movement/:id/:movementType?',
    name: 'MovementForm',
    component: MovementForm,
    meta: { requiresAuth: true, permissions: ['inventory.movements.store'] },
  },
  {
    path: '/pos',
    name: 'POS',
    component: POS,
    meta: { requiresAuth: true, permissions: ['sales.store'] },
  },
  {
    path: '/403',
    name: 'AccessDenied',
    component: AccessDenied, // Página de acceso denegado
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
/*   {
    path: '/test-real-time-messages',
    name: 'RealTimeMessages',
    component: RealTimeMessages,
  }, */
];


// Crear la instancia del router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de autenticación y autorización
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Cargar datos del usuario si no están cargados
  authStore.checkAuth();

  if (to.name === 'Login' && !isSubdomain()) return next('/404');
  if (to.name === 'Register' && isSubdomain()) return next('/404');

  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) return next('/login');
  if (to.meta.requiresGuest && authStore.isAuthenticated) return next('/dashboard');

  // Verificar roles
  if (to.meta.roles && !to.meta.roles.some((role) => authStore.hasRole(role))) {
    return next('/403'); // Redirigir a una página de acceso denegado
  }

  // Verificar permisos
  if (to.meta.permissions && !to.meta.permissions.every((perm) => authStore.hasPermission(perm))) {
    return next('/403');
  }

  next();
});

export default router;
