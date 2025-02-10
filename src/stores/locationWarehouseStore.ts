// src/stores/locationWarehouseStore.ts
import { defineStore } from "pinia";

export const useLocationWarehouseStore = defineStore("locationWarehouse", {
  state: () => ({
    // 🔹 Locales
    locationList: [] as Array<{ id: number; name: string }>,
    selectedLocation: null as number | null,

    // 🔹 Bodegas
    warehouseList: [] as Array<{ id: number; name: string }>,
    selectedWarehouse: null as number | null,
  }),
  actions: {
    // Setters para la lista y la selección
    setLocationList(list: Array<{ id: number; name: string }>) {
      this.locationList = list;
    },
    setLocation(locationId: number | null) {
      this.selectedLocation = locationId;
    },

    setWarehouseList(list: Array<{ id: number; name: string }>) {
      this.warehouseList = list;
    },
    setWarehouse(warehouseId: number | null) {
      this.selectedWarehouse = warehouseId;
    },
  },
});
