<!-- src/views/Sales/POS.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useCashRegister } from '@/composables/useCashRegister';
import { usePOS } from '@/composables/usePOS';
import CashRegisterOpen from '@/components/Sales/CashRegisterOpen.vue';
import POSSearch from '@/components/Sales/POSSearch.vue';
import POSProductTable from '@/components/Sales/POSProductTable.vue';
import POSTotals from '@/components/Sales/POSTotals.vue';

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
  <div class="flex flex-col bg-gray-100 container-fill">
    <div class="flex flex-1 overflow-hidden">
      <!-- Si la caja está cerrada, mostrar apertura -->
      <CashRegisterOpen v-if="!isOpen" />

      <!-- Si la caja está abierta, mostrar POS -->
      <div v-else class="flex-1 bg-white p-4 flex flex-col">
        <!-- Componente de Búsqueda -->
        <POSSearch @search="handleSearch" :error="searchError" />

        <!-- Tabla de Productos -->
        <POSProductTable
          :items="selectedItems"
          @remove="removeItem"
          @update-quantity="updateQuantity"
        />

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
  </div>
</template>
