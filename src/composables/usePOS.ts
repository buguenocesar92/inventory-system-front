// src/composables/usePOS.ts
import { ref, computed } from 'vue';
import { fetchProductByBarcode } from '@/services/ProductService';
import { registerSale } from '@/services/SaleService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { SelectedProduct } from '@/types/ProductTypes';

export function usePOS() {
  const selectedItems = ref<SelectedProduct[]>([]);
  const totalAmount = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
  );
  const searchError = ref<string | null>(null);
  const saleError = ref<string | null>(null);
  const isLoading = ref(false);

  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { errorMessage, handleValidationError } = useFormValidation();

  async function handleSearch(barcode: string) {
    try {
      isLoading.value = true;
      const product = await fetchProductByBarcode(barcode);
      const existingProduct = selectedItems.value.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        selectedItems.value.push({
          id: product.id,
          name: product.name,
          category: product.category,
          brand: product.brand,
          barcode: product.barcode,
          description: product.description,
          image_url: product.image_url,
          unit_price: Number(product.unit_price),
          quantity: 1,
        });
      }
    } catch (error) {
      handleValidationError(error);
      searchError.value = errorMessage.value;
    } finally {
      isLoading.value = false;
    }
  }

  async function confirmSale() {
    try {
      isLoading.value = true;
      const salePayload = {
        items: selectedItems.value.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };
      await registerSale(salePayload);
      await showSuccessNotification('Venta confirmada', 'La venta se realizó exitosamente.');
      selectedItems.value = [];
    } catch (error) {
      handleValidationError(error);
      showErrorNotification('Error al confirmar venta', errorMessage.value || '');
    } finally {
      isLoading.value = false;
    }
  }

  function clearSale() {
    selectedItems.value = [];
  }

  function removeItem(index: number) {
    selectedItems.value.splice(index, 1);
  }

  function updateQuantity(index: number, quantity: number) {
    selectedItems.value[index].quantity = quantity;
  }

  return {
    selectedItems,
    totalAmount,
    searchError,
    saleError,
    isLoading,
    handleSearch,
    confirmSale,
    clearSale,
    removeItem,
    updateQuantity,
  };
}
