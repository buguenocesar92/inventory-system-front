<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-4xl bg-white shadow-md rounded px-8 py-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Sales Module</h1>

      <!-- Lista de productos seleccionados -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Selected Items</h2>
        <ul v-if="selectedItems.length > 0" class="divide-y">
          <li
            v-for="(item, index) in selectedItems"
            :key="item.id"
            class="flex justify-between items-center py-2"
          >
            <div>
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-500">{{ item.category }}</p>
            </div>
            <input
              type="number"
              v-model.number="item.quantity"
              min="1"
              class="border rounded px-2 py-1 w-16 text-center"
            />
            <p class="font-medium">${{ (item.unit_price * item.quantity).toFixed(2) }}</p>
            <button
              @click="removeItem(index)"
              class="text-red-500 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </li>
        </ul>
        <p v-else class="text-center text-gray-500">No items selected</p>
      </div>

      <!-- Resumen de Totales -->
      <div class="text-right mb-6">
        <p class="text-lg font-semibold">Total: ${{ totalAmount.toFixed(2) }}</p>
      </div>

      <!-- Acciones -->
      <div class="flex gap-4 mb-6">
        <button
          @click="handleConfirmSale"
          :disabled="selectedItems.length === 0"
          class="w-full bg-green-500 text-white font-medium py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          Confirm Sale
        </button>
        <button
          @click="clearSale"
          class="w-full bg-red-500 text-white font-medium py-2 rounded hover:bg-red-600 transition-colors"
        >
          Clear Sale
        </button>
      </div>

      <!-- Teclado Numérico -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Numpad</h2>
        <div class="grid grid-cols-3 gap-4">
          <button
            v-for="digit in numpad"
            :key="digit"
            @click="handleNumpadClick(digit)"
            class="bg-gray-200 hover:bg-gray-300 text-black font-medium py-3 rounded shadow"
          >
            {{ digit }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'SalesModule',
  setup() {
    // Lista de productos seleccionados
    const selectedItems = ref([
      { id: 1, name: 'Yoga Mat', category: 'Fitness', quantity: 1, unit_price: 30.0 },
    ]);

    // Numpad
    const numpad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    // Total calculado
    const totalAmount = computed(() =>
      selectedItems.value.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
    );

    // Funciones
    const handleNumpadClick = (digit: number) => {
      console.log(`Numpad digit clicked: ${digit}`);
    };

    const removeItem = (index: number) => {
      selectedItems.value.splice(index, 1);
    };

    const clearSale = () => {
      selectedItems.value = [];
    };

    const handleConfirmSale = async () => {
      try {
        // Simulación de confirmación de venta
        await Swal.fire({
          title: 'Confirm Sale',
          text: `Are you sure you want to confirm the sale? Total: $${totalAmount.value.toFixed(
            2
          )}`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, confirm!',
        });

        // Lógica para enviar los datos al backend
        console.log('Sale confirmed:', selectedItems.value);

        // Resetear la venta después de confirmar
        clearSale();
      } catch (error) {
        console.error('Error confirming sale:', error);
      }
    };

    return {
      selectedItems,
      numpad,
      totalAmount,
      handleNumpadClick,
      removeItem,
      clearSale,
      handleConfirmSale,
    };
  },
};
</script>

<style scoped>
/* Estilo básico del componente */
button {
  transition: all 0.3s;
}
</style>
