import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { isSubdomain } from '@/utils/domainUtils';

// Importar vistas
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
import RolePermissionManager from '../views/RolesPermissions/RolePermissionManager.vue';

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
    meta: { requiresAuth: true, permissions: [] },
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
    path: '/roles-permissions',
    name: 'RolePermissionManager',
    component: RolePermissionManager,
    meta: { requiresAuth: true, permissions: ['roles.with-permissions'] },
  },
  {
    path: '/403',
    name: 'AccessDenied',
    component: AccessDenied,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Verificar si la autenticación ya fue inicializada
  if (!authStore.isAuthenticated) {
    authStore.checkAuth(); // Verifica si hay tokens en localStorage
  }

  // Asegurarse de que los roles y permisos estén cargados antes de proceder
  if (!authStore.roles.length || !authStore.permissions.length) {
    try {
      await authStore.fetchUserData(); // Cargar datos del usuario
    } catch (error) {
      console.error('Error loading user data:', error);
      return next('/login'); // Redirigir al login si hay un problema
    }
  }

  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard');
  }

  // Verificar roles
  if (to.meta.roles && !to.meta.roles.some((role) => authStore.hasRole(role))) {
    return next('/403'); // Redirigir a una página de acceso denegado
  }

  // Verificar permisos
  if (to.meta.permissions && !to.meta.permissions.every((perm) => authStore.hasPermission(perm))) {
    return next('/403');
  }

  next(); // Permitir la navegación
});


export default router;
