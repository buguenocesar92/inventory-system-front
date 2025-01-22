// src/composables/useCashRegister.ts
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { openCashRegister, closeCashRegister, getCashRegisterStatus } from '@/services/CashRegisterService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';

export function useCashRegister() {
  const isOpen = ref(false);
  const isLoading = ref(false);
  const router = useRouter(); // Instancia del router
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { handleValidationError, errorMessage } = useFormValidation();

  /**
   * Obtiene el estado actual de la caja desde el backend.
   */
  async function fetchCashRegisterStatus() {
    isLoading.value = true;
    try {
      const status = await getCashRegisterStatus();
      isOpen.value = status.is_open;
    } catch (error) {
      handleValidationError(error);
      showErrorNotification('Error al consultar el estado de la caja', errorMessage.value || 'Ocurrió un error inesperado.');
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Maneja la apertura de caja.
   * @param openingAmount - Monto inicial para la caja.
   */
  async function handleOpenCashRegister(openingAmount: number) {
    isLoading.value = true;
    try {
      await openCashRegister({ opening_amount: openingAmount });
      isOpen.value = true;
      showSuccessNotification('Caja abierta', 'La caja se abrió exitosamente.');
      router.push({ name: 'POS' });
    } catch (error) {
      handleValidationError(error);
      showErrorNotification('Error al abrir caja', errorMessage.value || 'Ocurrió un error inesperado.');
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Maneja el cierre de caja.
   * @param closingAmount - Monto final para la caja.
   */
  async function handleCloseCashRegister(closingAmount: number) {
    isLoading.value = true;
    try {
      await closeCashRegister({ closing_amount: closingAmount });
      isOpen.value = false;
      showSuccessNotification('Caja cerrada', 'La caja se cerró exitosamente.');
      router.push({ name: 'Dashboard' });
    } catch (error) {
      handleValidationError(error);
      showErrorNotification('Error al cerrar caja', errorMessage.value || 'Ocurrió un error inesperado.');
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isOpen,
    isLoading,
    fetchCashRegisterStatus,
    handleOpenCashRegister,
    handleCloseCashRegister,
  };
}
