<template>
  <div class="flex flex-col h-screen bg-gray-100">

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Center Panel -->
      <div class="flex-1 bg-white p-4">
        <!-- Search Bar -->
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

        <!-- Product List Table -->
        <v-data-table
          :headers="headers"
          :items="selectedItems"
          class="elevation-1"
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
                  @input="updateTotal"
                ></v-text-field>
              </td>
              <td class="border px-2 py-1 text-right">${{ (item.unit_price * item.quantity).toFixed(2) }}</td>
              <td class="border px-2 py-1 text-center">
                <v-btn
                  icon
                  color="error"
                  @click="removeItem(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>

      <!-- Right Panel -->
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
        <v-btn
          color="error"
          @click="clearSale"
        >
          Cancelar Venta
        </v-btn>
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
    const search = ref('');
    const searchError = ref<string | null>(null);
    const selectedItems = ref<SelectedProduct[]>([]);
    const saleError = ref<string | null>(null);
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
        searchError.value = null;
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

    const clearSale = () => {
      selectedItems.value = [];
    };

    const updateTotal = () => {
      // Propiedad computada se encarga del cálculo
    };

    const removeItem = (index: number) => {
      selectedItems.value.splice(index, 1);
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
