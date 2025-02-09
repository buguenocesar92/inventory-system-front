import { ref, onMounted } from "vue";
import { fetchLocations } from "@/services/LocationService";
import { useNotification } from "@/composables/useNotification";
import { useFormValidation } from "@/composables/useFormValidation";

export function useLocationSelect() {
  const { showErrorNotification, /* showSuccessNotification */ } = useNotification();
  const { errors, errorMessage, handleValidationError } = useFormValidation();

  const locations = ref<{ id: number; name: string }[]>([]);
  const selectedLocation = ref<number | null>(null);

  /**
   * Cargar la lista de locales al montar el componente
   */
  async function loadLocations() {
    try {
      locations.value = await fetchLocations();
     /*  showSuccessNotification("Éxito", "Lista de locales cargada correctamente."); */
    } catch (error) {
      handleValidationError(error);
      showErrorNotification("Error", errorMessage.value || "No se pudieron cargar los locales.");
    }
  }

  /**
   * Manejar cambio de local seleccionado
   */
  function handleLocationChange() {
    console.log("Local seleccionado:", selectedLocation.value);
    // Aquí puedes almacenar la selección en Vuex, Pinia o LocalStorage si lo necesitas
  }

  onMounted(() => {
    loadLocations();
  });

  return {
    locations,
    selectedLocation,
    handleLocationChange,
    errors, // Exponer errores si se necesitan en el frontend
  };
}
