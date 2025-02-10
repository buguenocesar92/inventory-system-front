import { ref, onMounted, watch, computed } from "vue";
import { fetchLocations } from "@/services/LocationService";
import { fetchWarehousesByLocation } from "@/services/WarehouseService";
import { useNotification } from "@/composables/useNotification";
import { useLocationWarehouseStore } from "@/stores/locationWarehouseStore"; // <- importamos la store

export function useLocationWarehouseSelect() {
  const { showErrorNotification } = useNotification();

  // Store de ubicación/bodega seleccionadas
  const locationWarehouseStore = useLocationWarehouseStore();

  // Opcional: listados locales (no se guardan globalmente)
  const locations = ref<{ id: number; name: string }[]>([]);
  const warehouses = ref<{ id: number; name: string }[]>([]);

  /**
   * Cargar locales desde el backend
   */
  async function loadLocations() {
    try {
      locations.value = await fetchLocations();
    } catch {
      showErrorNotification("Error", "No se pudieron cargar los locales");
    }
  }

  /**
   * Cargar bodegas basadas en el local seleccionado
   */
  async function loadWarehouses(locationId: number) {
    try {
      warehouses.value = await fetchWarehousesByLocation(locationId);
      locationWarehouseStore.setWarehouse(null); // Resetear bodega en la store
    } catch {
      showErrorNotification("Error", "No se pudieron cargar las bodegas");
    }
  }

  /**
   * Manejar el cambio de local.
   * (Llamado cuando `selectedLocation` cambie)
   */
  function handleLocationChange() {
    if (!locationWarehouseStore.selectedLocation) {
      warehouses.value = [];
      locationWarehouseStore.setWarehouse(null);
    } else {
      loadWarehouses(locationWarehouseStore.selectedLocation);
    }
  }

  /**
   * Manejar el cambio de bodega.
   * (Llamado cuando `selectedWarehouse` cambie)
   */
  function handleWarehouseChange() {
    console.log("Bodega seleccionada:", locationWarehouseStore.selectedWarehouse);
  }

  // Watch para cada vez que cambie "selectedLocation" en la store
  watch(
    () => locationWarehouseStore.selectedLocation,
    () => {
      handleLocationChange();
    }
  );

  // Watch para cada vez que cambie "selectedWarehouse" en la store
  watch(
    () => locationWarehouseStore.selectedWarehouse,
    () => {
      handleWarehouseChange();
    }
  );

  // Cargar locales al iniciar
  onMounted(loadLocations);

  // Opcional: podrías exponer dos "computed" para usar v-model en el template
  const selectedLocation = computed({
    get: () => locationWarehouseStore.selectedLocation,
    set: (val: number | null) => locationWarehouseStore.setLocation(val),
  });

  const selectedWarehouse = computed({
    get: () => locationWarehouseStore.selectedWarehouse,
    set: (val: number | null) => locationWarehouseStore.setWarehouse(val),
  });

  return {
    // Listados locales
    locations,
    warehouses,

    // Acceso a la store (o a tus computed si prefieres)
    selectedLocation,
    selectedWarehouse,

    // Métodos
    handleLocationChange,
    handleWarehouseChange,
  };
}
