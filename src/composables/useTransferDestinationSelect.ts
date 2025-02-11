// src/composables/useTransferDestinationSelect.ts
import { ref, watch } from 'vue';
import { fetchWarehousesByLocation } from '@/services/WarehouseService';

export function useTransferDestinationSelect() {
  // Variable para el local de destino seleccionado
  const selectedDestinationLocation = ref<number | null>(null);
  // Lista de bodegas según el local de destino
  const destinationWarehouseList = ref<Array<{ id: number; name: string }>>([]);
  // Bodega de destino seleccionada
  const selectedDestinationWarehouse = ref<number | null>(null);

  // Función para cargar las bodegas según el local de destino
  async function loadDestinationWarehouses(locationId: number): Promise<void> {
    try {
      const data = await fetchWarehousesByLocation(locationId);
      destinationWarehouseList.value = data;
      selectedDestinationWarehouse.value = null;
    } catch (error) {
      console.error('Error cargando bodegas de destino', error);
    }
  }

  // Cada vez que cambie el local de destino se actualiza la lista de bodegas
  watch(selectedDestinationLocation, (newVal) => {
    if (newVal) {
      loadDestinationWarehouses(newVal);
    } else {
      destinationWarehouseList.value = [];
      selectedDestinationWarehouse.value = null;
    }
  });

  return {
    selectedDestinationLocation,
    destinationWarehouseList,
    selectedDestinationWarehouse,
    loadDestinationWarehouses,
  };
}
