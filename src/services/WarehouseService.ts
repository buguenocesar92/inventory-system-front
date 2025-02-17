import axios from "@/axiosConfig";
import type { WarehousePayload } from '@/types/WarehouseTypes';
/**
 * Obtiene todas las bodegas de un local específico.
 */
export async function fetchWarehousesByLocation(locationId: number) {
  const response = await axios.get(`/locations/${locationId}/warehouses`);
  return response.data;
}


/**
 * Obtiene todos los almacenes.
 */
export async function fetchWarehouses(): Promise<WarehousePayload[]> {
  const response = await axios.get('/warehouses');
  return response.data;
}

/**
 * Obtiene un almacén por ID.
 */
export async function fetchWarehouseById(id: number): Promise<WarehousePayload> {
  const response = await axios.get(`/warehouses/${id}`);
  return response.data;
}

/**
 * Elimina un almacén.
 */
export async function deleteWarehouse(id: number): Promise<void> {
  await axios.delete(`/warehouses/${id}`);
}

/**
 * Crea un nuevo almacén.
 */
export async function createWarehouse(data: WarehousePayload): Promise<WarehousePayload> {
  const response = await axios.post('/warehouses', data);
  return response.data;
}

/**
 * Actualiza un almacén existente.
 */
export async function updateWarehouse(id: number, data: WarehousePayload): Promise<WarehousePayload> {
  const response = await axios.put(`/warehouses/${id}`, data);
  return response.data;
}
