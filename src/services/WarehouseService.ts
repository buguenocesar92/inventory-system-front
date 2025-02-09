import axios from "@/axiosConfig";

/**
 * Obtiene todas las bodegas de un local específico.
 */
export async function fetchWarehousesByLocation(locationId: number) {
  const response = await axios.get(`/locations/${locationId}/warehouses`);
  return response.data;
}
