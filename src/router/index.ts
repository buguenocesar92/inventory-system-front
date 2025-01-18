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

// Crear el router con historial web
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardas de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Verificar si la autenticación está inicializada
  if (!authStore.isAuthenticated) {
    authStore.checkAuth(); // Verifica los tokens en el almacenamiento local
  }

  // Cargar roles y permisos si aún no están disponibles
  if (!authStore.roles.length || !authStore.permissions.length) {
    try {
      await authStore.fetchUserData(); // Cargar datos del usuario
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      return next('/login'); // Redirigir al inicio de sesión si hay problemas
    }
  }

  // Requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }
  // Evitar que usuarios autenticados accedan a rutas para invitados
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard');
  }

  // Verificar roles
  if (to.meta.roles && !to.meta.roles.some((role) => authStore.hasRole(role))) {
    return next('/403'); // Redirigir a acceso denegado
  }

  // Verificar permisos
  if (to.meta.permissions && !to.meta.permissions.every((perm) => authStore.hasPermission(perm))) {
    return next('/403');
  }

  // Permitir la navegación
  next();
});

export default router;
