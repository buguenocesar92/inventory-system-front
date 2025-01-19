import { createRouter, createWebHistory } from 'vue-router';
import { useAuthGuard } from '@/composables/useAuthGuard';
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
import RolePermissionEdit from '../views/RolesPermissions/RolePermissionEdit.vue';

// Definir las rutas de la aplicación
const routes = [
  {
    path: '/',
    redirect: () => (isSubdomain() ? '/dashboard' : '/register'),
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true, sidebar: false, label: 'Login', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true, sidebar: false, label: 'Register', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, permissions: [], sidebar: true, label: 'Dashboard', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/register-user',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: { requiresAuth: true, roles: ['admin'], sidebar: false, label: 'Register User', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true, permissions: ['products.store'], sidebar: false, label: 'Add Product', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/edit-product/:id',
    name: 'EditProduct',
    component: EditProduct,
    meta: { requiresAuth: true, permissions: ['products.update'], sidebar: false },
    props: true,
  },
  {
    path: '/list-product',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true, permissions: ['products.index'], sidebar: true, label: 'Products', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/movement/:id/:movementType?',
    name: 'MovementForm',
    component: MovementForm,
    meta: { requiresAuth: true, permissions: ['inventory.movements.store'], sidebar: false },
  },
  {
    path: '/pos',
    name: 'POS',
    component: POS,
    meta: { requiresAuth: true, permissions: ['sales.store'], sidebar: true, label: 'POS', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/roles-permissions',
    name: 'RolePermissionManager',
    component: RolePermissionManager,
    meta: { requiresAuth: true, permissions: ['roles.with-permissions'], sidebar: true, label: 'Roles & Permissions', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/role-permission-edit/:roleId',
    name: 'RolePermissionEdit',
    component: RolePermissionEdit,
    meta: { requiresAuth: true, permissions: ['roles.with-permissions.show'], sidebar: false },
    props: true,
  },
  {
    path: '/403',
    name: 'AccessDenied',
    component: AccessDenied,
    meta: { sidebar: false },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { sidebar: false },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
];

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de navegación
router.beforeEach(async (to, from, next) => {
  const {
    isAuthenticated,
    checkAuth,
    fetchUserDataIfNeeded,
    hasAnyRole,
    hasAllPermissions,
    doLogout,
  } = useAuthGuard();

  try {
    if (!isAuthenticated()) {
      await checkAuth();
    }

    if (isAuthenticated()) {
      await fetchUserDataIfNeeded();
    }

    // Validar acceso a rutas específicas según subdominio
    if (to.name === 'Register' && isSubdomain()) {
      return next('/dashboard'); // Redirigir a Dashboard si estás en un subdominio
    }

    if (to.name === 'Login' && !isSubdomain()) {
      return next('/register'); // Redirigir a Register si no estás en un subdominio
    }

    // Validar rutas que requieren autenticación
    if (to.meta.requiresAuth && !isAuthenticated()) {
      return next('/login');
    }

    // Validar rutas solo para invitados
    if (to.meta.requiresGuest && isAuthenticated()) {
      return next('/dashboard');
    }

    // Validar roles si están definidos en meta
    if (to.meta.roles && !hasAnyRole(to.meta.roles)) {
      return next('/403');
    }

    // Validar permisos si están definidos en meta
    if (to.meta.permissions && !hasAllPermissions(to.meta.permissions)) {
      return next('/403');
    }

    next();
  } catch (error) {
    console.error(error);
    doLogout();
    next('/login');
  }
});



export default router;
