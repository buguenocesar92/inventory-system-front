import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Esta store guarda **solo** los valores seleccionados globalmente:
 * - selectedLocation
 * - selectedWarehouse
 */
export const useLocationWarehouseStore = defineStore("locationWarehouse", () => {
  // 🔹 Estado reactivo global
  const selectedLocation = ref<number | null>(null);
  const selectedWarehouse = ref<number | null>(null);

  // 🔹 Acciones para setear los valores
  function setLocation(locationId: number | null) {
    selectedLocation.value = locationId;
  }

  function setWarehouse(warehouseId: number | null) {
    selectedWarehouse.value = warehouseId;
  }

  return {
    selectedLocation,
    selectedWarehouse,
    setLocation,
    setWarehouse,
  };
});
