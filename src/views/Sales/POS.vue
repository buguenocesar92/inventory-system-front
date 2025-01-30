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
  <div v-if="!isOpen" class="p-4 bg-gray-100 flex flex-col items-center">
    <h2 class="text-xl font-bold">Caja Cerrada</h2>
    <p class="text-gray-600">Por favor, abre la caja para continuar.</p>
    <v-btn color="primary" to="/cash-register-open">Ir a Apertura de Caja</v-btn>
  </div>

  <div v-else class="flex flex-col bg-gray-100 shadow-lg rounded-lg overflow-hidden">
    <div class="flex flex-1 overflow-hidden">
      <!-- Panel Central -->
      <div class="flex-1 bg-white p-4 flex flex-col">
        <!-- Componente de Búsqueda -->
        <POSSearch @search="handleSearch" :error="searchError ?? undefined" />

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
</AdminWrapper>
</template>
