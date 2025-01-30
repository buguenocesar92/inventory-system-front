import { useAuthGuard } from '@/composables/useAuthGuard';
import { useCashRegister } from '@/composables/useCashRegister';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const { isAuthenticated, checkAuth, fetchUserDataIfNeeded, hasAnyRole, hasAllPermissions, doLogout } = useAuthGuard();
  const { isOpen, fetchCashRegisterStatus } = useCashRegister();

  try {
    if (!isAuthenticated.value) {
      await checkAuth();
    }

    if (isAuthenticated.value) {
      await fetchUserDataIfNeeded();
    }

    // 🔹 Bloquear rutas que requieren autenticación
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      return next('/login');
    }

    // 🔹 Bloquear rutas para invitados
    if (to.meta.requiresGuest && isAuthenticated.value) {
      return next('/dashboard');
    }

    // 🔹 Verificar roles
    if (to.meta.roles && !hasAnyRole(to.meta.roles as string[])) {
      return next('/403');
    }

    // 🔹 Verificar permisos
    if (to.meta.permissions && !hasAllPermissions(to.meta.permissions as string[])) {
      return next('/403');
    }

    // 🔹 Verificar si la caja está abierta antes de permitir el cierre
    if (to.meta.requiresOpenCashRegister) {
      await fetchCashRegisterStatus();
      if (!isOpen.value) {
        return next('/cash-register-open');
      }
    }

    next();
  } catch (error) {
    console.error('Error en la navegación:', error);
    await doLogout();
    next('/login');
  }
}
