import { ref, onMounted } from "vue";
import { fetchLocations } from "@/services/LocationService";
import { fetchWarehousesByLocation } from "@/services/WarehouseService";
import { useNotification } from "@/composables/useNotification";

export function useLocationWarehouseSelect() {
  const { showErrorNotification } = useNotification();

  // 🔹 Datos de locales y bodegas sin opción por defecto
  const locations = ref<{ id: number; name: string }[]>([]);
  const selectedLocation = ref<number | null>(null);

  const warehouses = ref<{ id: number; name: string }[]>([]);
  const selectedWarehouse = ref<number | null>(null);

  /**
   * Cargar locales desde el backend.
   */
  async function loadLocations() {
    try {
      locations.value = await fetchLocations();
    } catch {
      showErrorNotification("Error", "No se pudieron cargar los locales");
    }
  }

  /**
   * Cargar bodegas basadas en el local seleccionado.
   */
  async function loadWarehouses(locationId: number) {
    try {
      warehouses.value = await fetchWarehousesByLocation(locationId);
      selectedWarehouse.value = null; // Resetear selección
    } catch {
      showErrorNotification("Error", "No se pudieron cargar las bodegas");
    }
  }

  /**
   * Manejar el cambio de local.
   */
  function handleLocationChange() {
    if (!selectedLocation.value) {
      warehouses.value = [];
      selectedWarehouse.value = null;
    } else {
      loadWarehouses(selectedLocation.value);
    }
  }

  /**
   * Manejar el cambio de bodega.
   */
  function handleWarehouseChange() {
    console.log("Bodega seleccionada:", selectedWarehouse.value);
  }

  // 🔹 Cargar locales al iniciar
  onMounted(loadLocations);

  return {
    locations,
    selectedLocation,
    handleLocationChange,
    warehouses,
    selectedWarehouse,
    handleWarehouseChange,
  };
}
