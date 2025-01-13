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

// Definición de rutas
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
    meta: { requiresAuth: true },
  },
  {
    path: '/register-user',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAuth: true },
  },
  {
    path: '/edit-product/:id',
    name: 'EditProduct',
    component: EditProduct,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/list-product',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true },
  },
  {
    path: '/movement/:id/:movementType?',
    name: 'MovementForm',
    component: MovementForm,
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
];

// Crear la instancia del router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de autenticación con Pinia
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.checkAuth();

  if (to.name === 'Login' && !isSubdomain()) return next('/404');
  if (to.name === 'Register' && isSubdomain()) return next('/404');

  if (to.meta.requiresAuth && !authStore.isAuthenticated) return next('/login');
  if (to.meta.requiresGuest && authStore.isAuthenticated) return next('/dashboard');

  next();
});

export default router;
