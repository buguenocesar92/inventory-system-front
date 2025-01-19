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
import RolePermissionEdit  from '../views/RolesPermissions/RolePermissionEdit.vue';


// Definir las rutas de la aplicación
const routes = [
  // Redirigir dependiendo del subdominio
  {
    path: '/',
    redirect: () => (isSubdomain() ? '/dashboard' : '/register'),
  },
  // Página de inicio de sesión
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  // Página de registro
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },
  // Panel principal (Dashboard)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, permissions: [] },
  },
  // Registrar usuarios (solo para administradores)
  {
    path: '/register-user',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  // Agregar un producto
  {
    path: '/add-product',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true, permissions: ['products.store'] },
  },
  // Editar un producto
  {
    path: '/edit-product/:id',
    name: 'EditProduct',
    component: EditProduct,
    meta: { requiresAuth: true, permissions: ['products.update'] },
    props: true,
  },
  // Listar productos
  {
    path: '/list-product',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true, permissions: ['products.index'] },
  },
  // Formulario de movimientos de inventario
  {
    path: '/movement/:id/:movementType?',
    name: 'MovementForm',
    component: MovementForm,
    meta: { requiresAuth: true, permissions: ['inventory.movements.store'] },
  },
  // Punto de venta (POS)
  {
    path: '/pos',
    name: 'POS',
    component: POS,
    meta: { requiresAuth: true, permissions: ['sales.store'] },
  },
  // Gestión de roles y permisos
  {
    path: '/roles-permissions',
    name: 'RolePermissionManager',
    component: RolePermissionManager,
    meta: { requiresAuth: true, permissions: ['roles.with-permissions'] },
  },
  {
    path: '/role-permission-edit/:roleId',
    name: 'RolePermissionEdit',
    component: RolePermissionEdit,
    meta: { requiresAuth: true, permissions: ['roles.with-permissions.show'] },
    props: true, // Permite pasar el parámetro `roleId` como prop al componente
  },
  // Acceso denegado
  {
    path: '/403',
    name: 'AccessDenied',
    component: AccessDenied,
  },
  // Página no encontrada
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  // Redirigir cualquier otra ruta a la página 404
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
  const {
    isAuthenticated,
    checkAuth,
    fetchUserDataIfNeeded,
    hasAnyRole,
    hasAllPermissions,
    doLogout,
  } = useAuthGuard();

  try {
    // Verificar autenticación
    if (!isAuthenticated()) {
      await checkAuth();
    }

    // Cargar roles y permisos si faltan
    if (isAuthenticated()) {
      await fetchUserDataIfNeeded();
    }

    // Validaciones de meta
    if (to.meta.requiresAuth && !isAuthenticated()) {
      return next('/login');
    }

    if (to.meta.requiresGuest && isAuthenticated()) {
      return next('/dashboard');
    }

    if (to.meta.roles && !hasAnyRole(to.meta.roles)) {
      return next('/403');
    }

    if (to.meta.permissions && !hasAllPermissions(to.meta.permissions)) {
      return next('/403');
    }

    next(); // Permitir navegación
  } catch (error) {
    console.error(error);
    doLogout(); // Limpiar sesión en caso de error
    next('/login');
  }
});

export default router;
