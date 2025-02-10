// src/composables/useLocationWarehouseSelect.ts
import { computed, onMounted, watch } from "vue";
import { fetchLocations } from "@/services/LocationService";
import { fetchWarehousesByLocation } from "@/services/WarehouseService";
import { useNotification } from "@/composables/useNotification";
import { useLocationWarehouseStore } from "@/stores/locationWarehouseStore";

export function useLocationWarehouseSelect() {
  const { showErrorNotification } = useNotification();
  const locationWarehouseStore = useLocationWarehouseStore();

  // Usamos un computed para los locales, de modo que si la store ya tiene datos se usen inmediatamente
  const locations = computed(() => locationWarehouseStore.locationList);

  /**
   * Cargar locales:
   * - Si ya hay datos en la store, el computed se encargará de mostrarlos.
   * - Luego se hace el fetch para actualizar la información.
   */
  async function loadLocations() {
    try {
      const data = await fetchLocations();
      // Actualizamos la store con la lista de locales obtenida
      locationWarehouseStore.setLocationList(data);
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
      locationWarehouseStore.setWarehouseList(data);
      locationWarehouseStore.setWarehouse(null);
    } catch {
      showErrorNotification("Error", "No se pudieron cargar las bodegas");
    }
  }

  /**
   * Cuando cambia el local
   */
  function handleLocationChange() {
    if (!locationWarehouseStore.selectedLocation) {
      locationWarehouseStore.setWarehouseList([]);
      locationWarehouseStore.setWarehouse(null);
    } else {
      loadWarehouses(locationWarehouseStore.selectedLocation);
    }
  }

  /**
   * Cuando cambia la bodega
   */
  function handleWarehouseChange() {
    console.log("Bodega seleccionada:", locationWarehouseStore.selectedWarehouse);
  }

  // Al montar la vista se realiza el fetch de locales
  onMounted(loadLocations);

  // Watch para detectar cambios en la selección del local y cargar las bodegas correspondientes
  watch(
    () => locationWarehouseStore.selectedLocation,
    handleLocationChange
  );

  // Watch para detectar cambios en la selección de la bodega
  watch(
    () => locationWarehouseStore.selectedWarehouse,
    handleWarehouseChange
  );

  // Computeds para usar en v-model de los selects
  const selectedLocation = computed({
    get: () => locationWarehouseStore.selectedLocation,
    set: (val: number | null) => locationWarehouseStore.setLocation(val),
  });

  const selectedWarehouse = computed({
    get: () => locationWarehouseStore.selectedWarehouse,
    set: (val: number | null) => locationWarehouseStore.setWarehouse(val),
  });

  return {
    locationWarehouseStore,
    locations,
    selectedLocation,
    selectedWarehouse,
    handleLocationChange,
    handleWarehouseChange,
  };
}
