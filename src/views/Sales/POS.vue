<template>
  <div class="flex flex-col bg-gray-100 container-fill">
    <div class="flex flex-1 overflow-hidden">
      <!-- Panel Central -->
      <div class="flex-1 bg-white p-4 flex flex-col">
        <div class="flex items-center mb-4">
          <label for="product-code" class="mr-2 font-medium">Código del Producto:</label>
          <v-text-field
            id="product-code"
            v-model="search"
            placeholder="Buscar producto"
            outlined
            dense
            @keydown.enter="searchProduct"
          ></v-text-field>
        </div>
        <p v-if="searchError" class="text-red-500 mb-4">{{ searchError }}</p>

        <!-- Tabla de Productos -->
        <v-data-table
          :headers="headers"
          :items="selectedItems"
          class="elevation-1 flex-1"
          dense
        >
          <template v-slot:body="{ items }">
            <tr v-for="(item, index) in items" :key="index">
              <td class="border px-2 py-1">{{ item.barcode }}</td>
              <td class="border px-2 py-1">{{ item.name }}</td>
              <td class="border px-2 py-1 text-right">${{ item.unit_price.toFixed(2) }}</td>
              <td class="border px-2 py-1 text-right">
                <v-text-field
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  class="w-16 text-right"
                  dense
                  hide-details
                ></v-text-field>
              </td>
              <td class="border px-2 py-1 text-right">${{ (item.unit_price * item.quantity).toFixed(2) }}</td>
              <td class="border px-2 py-1 text-center">
                <v-btn icon color="error" @click="removeItem(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>

      <!-- Panel Derecho -->
      <div class="w-1/4 bg-gray-200 p-4 flex flex-col">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Totales</h3>
          <p class="text-sm">Total: ${{ totalAmount.toFixed(2) }}</p>
        </div>
        <v-btn
          color="success"
          :disabled="selectedItems.length === 0 || isLoading"
          @click="confirmSale"
          class="mb-2"
        >
          {{ isLoading ? 'Confirmando...' : 'Confirmar Venta' }}
        </v-btn>
        <v-btn color="error" @click="clearSale">Cancelar Venta</v-btn>
        <p v-if="saleError" class="text-red-500 mt-4">{{ saleError }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';
import { fetchProductByBarcode } from '@/services/ProductService';
import { registerSale } from '@/services/SaleService';
import type { SelectedProduct } from '@/types/ProductTypes';

export default {
  name: 'POS',
  setup() {
    const search = ref('');
    const { showSuccessNotification, showErrorNotification } = useNotification();
    const { errors, errorMessage, handleValidationError } = useFormValidation();

    const selectedItems = ref<SelectedProduct[]>([]);
    const saleError = ref<string | null>(null);
    const searchError = ref<string | null>(null);
    const isLoading = ref(false);

    const headers = [
      { text: 'Código de Barras', value: 'barcode' },
      { text: 'Descripción', value: 'name' },
      { text: 'Precio', value: 'unit_price', align: 'end' },
      { text: 'Cantidad', value: 'quantity', align: 'end' },
      { text: 'Importe', value: 'total', align: 'end' },
      { text: 'Acciones', value: 'actions', align: 'center' },
    ];

    const totalAmount = computed(() =>
      selectedItems.value.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
    );

    const searchProduct = async () => {
      try {
        isLoading.value = true;
        const product = await fetchProductByBarcode(search.value);
        const existingProduct = selectedItems.value.find((item) => item.id === product.id);

        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          if (product.id !== undefined) {
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
        } else {
          searchError.value = 'El producto no tiene un ID válido';
        }
        }

        search.value = '';
      } catch (error) {
        handleValidationError(error); // Manejar error desde composable
      } finally {
        isLoading.value = false;
      }
    };

    const confirmSale = async () => {
      try {
        isLoading.value = true;

        const salePayload = {
          items: selectedItems.value.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        };

        await registerSale(salePayload);

        await showSuccessNotification(
          'Venta confirmada',
          'La venta se realizó exitosamente.'
        );

        selectedItems.value = [];
      } catch (error) {
        handleValidationError(error); // Manejar error desde composable
        showErrorNotification('Error al confirmar venta', errorMessage.value || '');
      } finally {
        isLoading.value = false;
      }
    };

    const clearSale = () => {
      selectedItems.value = [];
    };

    const removeItem = (index: number) => {
      selectedItems.value.splice(index, 1);
    };

    return {
      search,
      errorMessage,
      errors,
      selectedItems,
      totalAmount,
      searchError,
      saleError,
      isLoading,
      searchProduct,
      confirmSale,
      clearSale,
      removeItem,
      headers,
    };
  },
};
</script>

<style scoped>
.table th, .table td {
  padding: 0.5rem;
  text-align: left;
}
</style>
