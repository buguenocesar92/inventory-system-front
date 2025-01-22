<template>
  <div class="flex flex-col bg-gray-100 container-fill">
    <div class="flex flex-1 overflow-hidden">
      <!-- Panel Central -->
      <div class="flex-1 bg-white p-4 flex flex-col">
        <!-- Componente de Búsqueda -->
        <POSSearch @search="handleSearch" :error="searchError" />

        <!-- Tabla de Productos -->
        <POSProductTable
          :items="selectedItems"
          @remove="removeItem"
          @update-quantity="updateQuantity"
        />
      </div>

      <!-- Panel Derecho -->
      <POSTotals
        :total="totalAmount"
        :is-loading="isLoading"
        :has-items="selectedItems.length > 0"
        @confirm="confirmSale"
        @clear="clearSale"
        :sale-error="saleError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import POSSearch from '@/components/Sales/POSSearch.vue';
import POSProductTable from '@/components/Sales/POSProductTable.vue';
import POSTotals from '@/components/Sales/POSTotals.vue';
import { fetchProductByBarcode } from '@/services/ProductService';
import { registerSale } from '@/services/SaleService';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import type { SelectedProduct } from '@/types/ProductTypes';

// Estado local
const searchError = ref<string | null>(null);
const selectedItems = ref<SelectedProduct[]>([]);
const saleError = ref<string | null>(null);
const isLoading = ref(false);

const { showSuccessNotification, showErrorNotification } = useNotification();
const { errorMessage, handleValidationError } = useFormValidation();

// Calcula el total
const totalAmount = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
);

// Métodos
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
</script>

