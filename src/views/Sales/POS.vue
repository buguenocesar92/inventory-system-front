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

    <div v-if="!isOpen" class="flex justify-center items-center h-[calc(100vh-190px)]">
      <div class="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Caja Cerrada</h2>
        <p class="text-gray-600 text-lg mb-6">Por favor, abre la caja para continuar.</p>

        <v-btn
          color="primary"
          to="/cash-register-open"
          class="w-full py-3 text-lg font-semibold rounded-lg transition-transform transform hover:scale-105"
        >
          Ir a Apertura de Caja
        </v-btn>
      </div>
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
