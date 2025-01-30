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
import Landing from '@/views/Landing.vue';

export const routes = [
  {
    path: '/',
    component: Landing,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true, sidebar: false, label: 'Iniciar Sesión', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true, sidebar: false, label: 'Registrarse', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, permissions: [], sidebar: true, label: 'Inicio', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/register-user',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: { requiresAuth: true, roles: ['admin'], sidebar: false, label: 'Registrar Usuario', icon: 'M4 6h16M4 12h16m-7 6h7' },
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
      icon: 'M4 6h16M4 12h16m-7 6h7',
    },
  },
  {
    path: '/categories/create',
    name: 'CategoryCreate',
    component: CategoryForm,
    meta: { requiresAuth: true, permissions: ['categories.store'], sidebar: false },
  },
  {
    path: '/categories/:id/edit',
    name: 'CategoryEdit',
    component: CategoryForm,
    meta: { requiresAuth: true, permissions: ['categories.update'], sidebar: false },
    props: true,
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true, permissions: ['products.store'], sidebar: false, label: 'Agregar Producto', icon: 'M4 6h16M4 12h16m-7 6h7' },
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
    meta: { requiresAuth: true, permissions: ['products.index'], sidebar: true, label: 'Productos', icon: 'M4 6h16M4 12h16m-7 6h7' },
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
    meta: { requiresAuth: true, permissions: ['sales.store'], sidebar: true, label: 'Punto de Venta', icon: 'M4 6h16M4 12h16m-7 6h7' },
  },
  {
    path: '/roles-permissions',
    name: 'RolePermissionManager',
    component: RolePermissionManager,
    meta: { requiresAuth: true, permissions: ['roles.with-permissions'], sidebar: true, label: 'Roles y Permisos', icon: 'M4 6h16M4 12h16m-7 6h7' },
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
      requiresOpenCashRegister: true,
      permissions: ['cash-register.close'],
      sidebar: false,
      label: 'Cerrar Caja',
      icon: 'M4 6h16M4 12h16m-7 6h7',
    },
  },
  {
    path: '/cash-register-open',
    name: 'CashRegisterOpen',
    component: CashRegisterOpen,
    meta: { requiresAuth: true, permissions: ['cash-register.open'], sidebar: false },
  },
  {
    path: '/products/:productId/movements',
    name: 'InventoryMovementHistory',
    component: InventoryMovementHistory,
    meta: { requiresAuth: true, permissions: ['inventory.movements.index'] },
  },
  {
    path: '/403',
    name: 'AccessDenied',
    component: AccessDenied,
    meta: { sidebar: false, label: 'Acceso Denegado' },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { sidebar: false, label: 'Página No Encontrada' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
];
