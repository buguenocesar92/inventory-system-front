<!-- src/views/Sales/POS.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useCashRegister } from '@/composables/useCashRegister';
import { usePOS } from '@/composables/usePOS';
import POSSearch from '@/components/Sales/POSSearch.vue';
import POSProductTable from '@/components/Sales/POSProductTable.vue';
import POSTotals from '@/components/Sales/POSTotals.vue';
import AdminWrapper from '@/components/AdminWrapper.vue';

const { isOpen, fetchCashRegisterStatus } = useCashRegister();
const {
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
} = usePOS();

// Consultar el estado de la caja al montar el componente
onMounted(fetchCashRegisterStatus);
</script>

<template>
  <AdminWrapper>
    <!-- Mensaje si la caja está cerrada -->
    <div v-if="!isOpen" class="p-6 bg-gray-100 flex flex-col items-center text-center">
      <h2 class="text-xl font-bold">Caja Cerrada</h2>
      <p class="text-gray-600 mb-4">Por favor, abre la caja para continuar.</p>
      <v-btn color="primary" to="/cash-register-open">Ir a Apertura de Caja</v-btn>
    </div>

    <div v-else class="bg-gray-100 shadow-lg rounded-lg p-4">
      <!-- Distribución flexible -->
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Panel de Productos -->
        <div class="flex-1 bg-white p-4 rounded-lg shadow-md">
          <POSSearch @search="handleSearch" :error="searchError ?? undefined" />
          <POSProductTable
            :items="selectedItems"
            @remove="removeItem"
            @update-quantity="updateQuantity"
          />
        </div>

        <!-- Panel Totales -->
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
  </AdminWrapper>
</template>
