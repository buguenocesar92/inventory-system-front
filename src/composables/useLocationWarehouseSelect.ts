// src/composables/useLocationWarehouseSelect.ts
import { ref, onMounted, watch, computed } from "vue";
import { fetchLocations } from "@/services/LocationService";
import { fetchWarehousesByLocation } from "@/services/WarehouseService";
import { useNotification } from "@/composables/useNotification";
import { useLocationWarehouseStore } from "@/stores/locationWarehouseStore";

export function useLocationWarehouseSelect() {
  const { showErrorNotification } = useNotification();
  // Accedemos a la store
  const locationWarehouseStore = useLocationWarehouseStore();

  // Lista de locales (opcional quedarla local)
  const locations = ref<{ id: number; name: string }[]>([]);

  /**
   * Cargar locales
   */
  async function loadLocations() {
    try {
      locations.value = await fetchLocations();
    } catch {
      showErrorNotification("Error", "No se pudieron cargar los locales");
    }
  }

  /**
   * Cargar bodegas desde el backend y guardarlas en la store
   */
  async function loadWarehouses(locationId: number) {
    try {
      const data = await fetchWarehousesByLocation(locationId);
      // Guardar la lista de bodegas en la store
      locationWarehouseStore.setWarehouseList(data);
      // Resetear bodega seleccionada (si así lo deseas)
      locationWarehouseStore.setWarehouse(null);
    } catch {
      showErrorNotification("Error", "No se pudieron cargar las bodegas");
    }
  }

  /**
   * Cuando cambie la local
   */
  function handleLocationChange() {
    if (!locationWarehouseStore.selectedLocation) {
      // Si local es null => limpiar lista de bodegas
      locationWarehouseStore.setWarehouseList([]);
      locationWarehouseStore.setWarehouse(null);
    } else {
      loadWarehouses(locationWarehouseStore.selectedLocation);
    }
  }

  /**
   * Cuando cambie la bodega
   */
  function handleWarehouseChange() {
    console.log("Bodega seleccionada:", locationWarehouseStore.selectedWarehouse);
  }

  // Cargar locales al montar
  onMounted(loadLocations);

  // Watch: cada vez que cambie la local en la store, manejarlo
  watch(
    () => locationWarehouseStore.selectedLocation,
    handleLocationChange
  );

  // Watch: cada vez que cambie la bodega
  watch(
    () => locationWarehouseStore.selectedWarehouse,
    handleWarehouseChange
  );

  // Computeds para v-model
  const selectedLocation = computed({
    get: () => locationWarehouseStore.selectedLocation,
    set: (val: number | null) => locationWarehouseStore.setLocation(val),
  });

  const selectedWarehouse = computed({
    get: () => locationWarehouseStore.selectedWarehouse,
    set: (val: number | null) => locationWarehouseStore.setWarehouse(val),
  });

  return {
    // Store para acceder a la lista de bodegas o setear algo directo
    locationWarehouseStore,

    // Lista local de locales
    locations,

    // "Accesos" directos a la selección
    selectedLocation,
    selectedWarehouse,

    // Métodos
    handleLocationChange,
    handleWarehouseChange,
  };
}
