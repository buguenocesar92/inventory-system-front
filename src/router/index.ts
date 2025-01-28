// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthGuard } from '@/composables/useAuthGuard';
/* import { isSubdomain } from '@/utils/domainUtils';
 */
// Vistas
import Login from '@/views/Auth/Login.vue';
import Register from '@/views/Auth/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import NotFound from '@/views/NotFound.vue';
import RegisterUser from '@/views/Users/RegisterUser.vue';
import AddProduct from '@/views/Products/AddProduct.vue';
import ProductList from '@/views/Products/ProductList.vue';
import EditProduct from '@/views/Products/EditProduct.vue';
import MovementForm from '@/views/Inventory/MovementForm.vue';
import POS from '@/views/Sales/POS.vue';
import AccessDenied from '@/views/AccessDenied.vue';
import RolePermissionManager from '@/views/RolesPermissions/RolePermissionManager.vue';
import RolePermissionEdit from '@/views/RolesPermissions/RolePermissionEdit.vue';
import CashRegisterClose from '@/views/Sales/CashRegisterClose.vue';
import CashRegisterOpen from '@/views/Sales/CashRegisterOpen.vue';
import CategoryManager from '@/views/Categories/CategoryManager.vue';
import CategoryForm from '@/views/Categories/CategoryForm.vue';
import InventoryMovementHistory from '@/views/Inventory/InventoryMovementHistory.vue';


import Landing from "@/views/Landing.vue";
const routes = [
  {
    path: '/',
    component: Landing,
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
    path: '/close-cash-register',
    name: 'CashRegisterClose',
    component: CashRegisterClose,
    meta: {
      requiresAuth: true,
      permissions: ['cash-register.close'], // Permiso necesario para cerrar caja
      sidebar: false, // No se muestra en el sidebar
      label: 'Cerrar Caja',
      icon: 'M4 6h16M4 12h16m-7 6h7', // Opcional si se usa un menú lateral
    },
  },
  {
    path: '/cash-register-open',
    name: 'CashRegisterOpen',
    component: CashRegisterOpen,
    meta: { requiresAuth: true, permissions: ['cash-register.open'], sidebar: false },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoryManager,
    meta: {
      requiresAuth: true,
      permissions: ['categories.index'],
      sidebar: true,
      label: 'Categorías',
      icon: 'M4 6h16M4 12h16m-7 6h7'
    }
  },
  {
    path: '/categories/create',
    name: 'CategoryCreate',
    component: CategoryForm,
    meta: {
      requiresAuth: true,
      permissions: ['categories.store'],
      sidebar: false
    }
  },
  {
    path: '/categories/:id/edit',
    name: 'CategoryEdit',
    component: CategoryForm,
    meta: {
      requiresAuth: true,
      permissions: ['categories.update'],
      sidebar: false
    },
    props: true
  },
  {
    path: '/products/:productId/movements',
    name: 'InventoryMovementHistory',
    component: InventoryMovementHistory,
    meta: {
      requiresAuth: true,
      permissions: ['inventory.movements.index']
    }
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
    // 1. Verificar si ya estamos autenticados (o cargar tokens del localStorage)
    if (!isAuthenticated.value) {
      await checkAuth();
    }

    // 2. Si el usuario está autenticado, obtener roles/permisos si aún no se han cargado
    if (isAuthenticated.value) {
      await fetchUserDataIfNeeded();
    }

    // 3. Redirecciones según subdominio y rutas públicas
/*     if (to.name === 'Register' && isSubdomain()) {
      return next('/dashboard');
    } */

/*     if (to.name === 'Login' && !isSubdomain()) {
      return next('/register');
    } */

    // 4. Si la ruta requiere autenticación pero no estamos logueados
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      return next('/login');
    }

    // 5. Si la ruta es solo para invitados y ya estamos logueados
    if (to.meta.requiresGuest && isAuthenticated.value) {
      return next('/dashboard');
    }

    // 6. Validar roles (si `to.meta.roles` está definido)
    if (to.meta.roles && !hasAnyRole(to.meta.roles as string[])) {
      return next('/403');
    }

    // 7. Validar permisos (si `to.meta.permissions` está definido)
    if (to.meta.permissions && !hasAllPermissions(to.meta.permissions as string[])) {
      return next('/403');
    }

    // 8. Si nada falla, acceder a la ruta
    next();
  } catch (error) {
    console.error('Error en la navegación:', error);
    // Forzar logout y redirigir a login si algo falla
    await doLogout();
    next('/login');
  }
});

export default router;
