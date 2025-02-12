import Login from '@/views/Auth/Login.vue';
import Register from '@/views/Auth/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import NotFound from '@/views/NotFound.vue';
import RegisterUser from '@/views/Users/RegisterUser.vue';
import AddProduct from '@/views/Products/AddProduct.vue';
import ProductList from '@/views/Products/ProductList.vue';
import EditProduct from '@/views/Products/EditProduct.vue';
import MovementForm from '@/views/Inventory/MovementForm.vue';
import AccessDenied from '@/views/AccessDenied.vue';
import RolePermissionManager from '@/views/RolesPermissions/RolePermissionManager.vue';
import RolePermissionEdit from '@/views/RolesPermissions/RolePermissionEdit.vue';
import CategoryManager from '@/views/Categories/CategoryManager.vue';
import CategoryForm from '@/views/Categories/CategoryForm.vue';
import InventoryMovementHistory from '@/views/Inventory/InventoryMovementHistory.vue';
import Landing from '@/views/Landing.vue';
import SalesHistoryList from '@/views/Sales/SalesHistoryList.vue';
import UsersManager from '@/views/Users/UserManager.vue';
import LocationManager from '@/views/Locations/LocationManager.vue';
import LocationForm from '@/views/Locations/LocationForm.vue';
import UserForm from '@/views/Users/UserForm.vue';


export const routes = [
  {
    path: '/',
    component: Landing,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true, sidebar: false, label: 'Iniciar Sesión', icon: 'mdi-login' },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true, sidebar: false, label: 'Registrarse', icon: 'mdi-account-plus' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, sidebar: true, label: 'Inicio', icon: 'mdi-view-dashboard' },
  },
  {
    path: '/register-user',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: { requiresAuth: true, roles: ['admin'], sidebar: false, label: 'Registrar Usuario', icon: 'mdi-account-plus' },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoryManager,
    meta: { requiresAuth: true, sidebar: true, label: 'Categorías', icon: 'mdi-tag-multiple' },
  },
  {
    path: '/categories/create',
    name: 'CategoryCreate',
    component: CategoryForm,
    meta: { requiresAuth: true, sidebar: false },
  },
  {
    path: '/categories/:id/edit',
    name: 'CategoryEdit',
    component: CategoryForm,
    meta: { requiresAuth: true, sidebar: false },
    props: true,
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true, sidebar: false, label: 'Agregar Producto', icon: 'mdi-package-variant-plus' },
  },
  {
    path: '/edit-product/:id',
    name: 'EditProduct',
    component: EditProduct,
    meta: { requiresAuth: true, sidebar: false },
    props: true,
  },
  {
    path: '/list-product',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true, sidebar: true, label: 'Productos', icon: 'mdi-package-variant' },
  },
  {
    path: '/movement/:id/:movementType?',
    name: 'MovementForm',
    component: MovementForm,
    meta: { requiresAuth: true, sidebar: false, label: 'Movimientos de Stock', icon: 'mdi-swap-horizontal' },
  },
  {
    path: '/roles-permissions',
    name: 'RolePermissionManager',
    component: RolePermissionManager,
    meta: { requiresAuth: true, sidebar: true, label: 'Roles y Permisos', icon: 'mdi-shield-account' },
  },
  {
    path: '/role-permission-edit/:roleId',
    name: 'RolePermissionEdit',
    component: RolePermissionEdit,
    meta: { requiresAuth: true, sidebar: false },
    props: true,
  },
  {
    path: '/products/:productId/movements',
    name: 'InventoryMovementHistory',
    component: InventoryMovementHistory,
    meta: { requiresAuth: true, sidebar: false, label: 'Historial de Movimientos', icon: 'mdi-history' },
  },
  {
    path: '/403',
    name: 'AccessDenied',
    component: AccessDenied,
    meta: { sidebar: false, label: 'Acceso Denegado', icon: 'mdi-shield-alert' },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { sidebar: false, label: 'Página No Encontrada', icon: 'mdi-alert-circle' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/sales-history',
    name: 'SalesHistory',
    component: SalesHistoryList,
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: 'Historial de Ventas',
      icon: 'mdi-history',
    },
  },
  {
    path : '/users',
    name: 'UsersManager',
    component: UsersManager,
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: 'Usuarios',
      icon: 'mdi-account-group',
    },
  },
  {
    path: '/users/:id/edit',
    name: 'UserEdit',
    component: UserForm,
    meta: { requiresAuth: true, sidebar: false },
    props: true,
  },
  {
    path : '/users/create',
    name: 'UserCreate',
    component: UserForm,
    meta: {
      requiresAuth: true,
      sidebar: false,
    },
  },
  {
    path : '/locations',
    name: 'LocationManager',
    component: LocationManager,
    meta: {
      requiresAuth: true,
      sidebar: true,
      label: 'Locales',
      icon: 'mdi-map-marker',
    },
  },
  {
    path : '/locations/create',
    name: 'LocationCreate',
    component: LocationForm,
    meta: {
      requiresAuth: true,
      sidebar: false,
    },
  },
  {
    path : '/locations/:id/edit',
    name: 'LocationEdit',
    component: LocationForm,
    meta: {
      requiresAuth: true,
      sidebar: false,
    },
    props: true,
  },
];
