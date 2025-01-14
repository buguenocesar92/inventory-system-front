<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-blue-700 text-white py-2 px-4 flex items-center justify-between shadow">
      <h1 class="text-lg font-semibold">POS - Punto de Venta</h1>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Panel -->
      <div class="w-1/4 bg-gray-200 p-2 shadow-inner">
        <ul class="space-y-2 text-sm">
          <li class="font-semibold">F1 Ventas</li>
          <li>F2 Créditos</li>
          <li>F3 Productos</li>
          <li>F4 Inventario</li>
        </ul>
      </div>

      <!-- Center Panel -->
      <div class="flex-1 bg-white p-4">
        <!-- Search Bar -->
        <div class="flex items-center mb-4">
          <label for="product-code" class="mr-2 font-medium">Código del Producto:</label>
          <input
            id="product-code"
            type="text"
            class="border px-2 py-1 rounded w-1/3"
            placeholder="Buscar producto"
            v-model="search"
            @keydown.enter="searchProduct"
          />
        </div>
        <p v-if="searchError" class="text-red-500 mb-4">{{ searchError }}</p>

        <!-- Product List Table -->
        <table class="w-full border text-sm">
          <thead class="bg-gray-200">
            <tr>
              <th class="border px-2 py-1 text-left">Código de Barras</th>
              <th class="border px-2 py-1 text-left">Descripción</th>
              <th class="border px-2 py-1 text-right">Precio</th>
              <th class="border px-2 py-1 text-right">Cantidad</th>
              <th class="border px-2 py-1 text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in selectedItems"
              :key="index"
              class="hover:bg-gray-100"
            >
              <td class="border px-2 py-1">{{ item.barcode }}</td>
              <td class="border px-2 py-1">{{ item.name }}</td>
              <td class="border px-2 py-1 text-right">${{ item.unit_price.toFixed(2) }}</td>
              <td class="border px-2 py-1 text-right">
                <input
                  type="number"
                  class="w-16 text-right border rounded px-1"
                  v-model.number="item.quantity"
                  min="1"
                  @input="updateTotal"
                />
              </td>
              <td class="border px-2 py-1 text-right">${{ (item.unit_price * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Right Panel -->
      <div class="w-1/4 bg-gray-200 p-4 flex flex-col">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Totales</h3>
          <p class="text-sm">Total: ${{ totalAmount.toFixed(2) }}</p>
        </div>
        <button
          class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded mb-2"
          :disabled="selectedItems.length === 0 || isLoading"
          @click="confirmSale"
        >
          {{ isLoading ? 'Confirmando...' : 'Confirmar Venta' }}
        </button>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded"
          @click="clearSale"
        >
          Cancelar Venta
        </button>
        <p v-if="saleError" class="text-red-500 mt-4">{{ saleError }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { fetchProduct } from '@/services/ProductService';
import { registerSale } from '@/services/SaleService';
import type { SelectedProduct } from '@/types/ProductTypes';

export default {
  name: 'POS',
  setup() {
    const search = ref(''); // Campo de búsqueda
    const searchError = ref<string | null>(null); // Error en búsqueda
    const selectedItems = ref<SelectedProduct[]>([]); // Productos seleccionados para la venta
    const saleError = ref<string | null>(null); // Error en confirmación de venta
    const isLoading = ref(false); // Estado de carga

    // Calcular el total
    const totalAmount = computed(() =>
      selectedItems.value.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
    );

    // Buscar producto por código de barras o nombre
    const searchProduct = async () => {
      try {
        isLoading.value = true;
        searchError.value = null; // Limpia errores previos

        const product = await fetchProduct(Number(search.value));
        const existingProduct = selectedItems.value.find(
          (item) => item.id === product.id
        );

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
        console.error('Error fetching product:', error);
        searchError.value = 'Producto no encontrado';
      } finally {
        isLoading.value = false;
      }
    };

    // Confirmar la venta
    const confirmSale = async () => {
      try {
        isLoading.value = true;
        saleError.value = null;

        const salePayload = {
          items: selectedItems.value.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        };

        await registerSale(salePayload);
        alert('Venta confirmada exitosamente');
        clearSale();
      } catch (error) {
        console.error('Error confirming sale:', error);
        saleError.value = 'No se pudo confirmar la venta. Inténtalo de nuevo.';
      } finally {
        isLoading.value = false;
      }
    };

    // Limpiar la venta actual
    const clearSale = () => {
      selectedItems.value = [];
    };

    // Actualizar el total
    const updateTotal = () => {
      // El cálculo está basado en la propiedad computada totalAmount
    };

    return {
      search,
      searchError,
      selectedItems,
      totalAmount,
      saleError,
      isLoading,
      searchProduct,
      confirmSale,
      clearSale,
      updateTotal,
    };
  },
};
</script>

<style scoped>
table th, table td {
  padding: 0.5rem;
  text-align: left;
}
</style>
