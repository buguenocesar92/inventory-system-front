<!-- src/views/Sales/POS.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useCashRegister } from '@/composables/useCashRegister';
import { usePOS } from '@/composables/usePOS';
import { useRouter } from 'vue-router';
import CashRegisterOpen from '@/components/Sales/CashRegisterOpen.vue';
import POSSearch from '@/components/Sales/POSSearch.vue';
import POSProductTable from '@/components/Sales/POSProductTable.vue';
import POSTotals from '@/components/Sales/POSTotals.vue';

const router = useRouter();
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

// Redirigir al cierre de caja
function navigateToCloseRegister() {
  router.push({ name: 'CashRegisterClose' });
}
</script>

<template>
  <!-- Apertura de Caja -->
  <CashRegisterOpen v-if="!isOpen" />

  <!-- POS Principal -->
  <div v-else class="flex flex-col bg-gray-100 container-fill">
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

    <!-- Botón para Cerrar Caja -->
    <div class="p-4 bg-gray-100 flex justify-end">
      <v-btn color="error" @click="navigateToCloseRegister">Cerrar Caja</v-btn>
    </div>
  </div>
</template>
