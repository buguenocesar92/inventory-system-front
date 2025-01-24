// src/services/InventoryMovementService.ts
import axios from '@/axiosConfig'
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes'

/**
 * Envía una solicitud al backend para actualizar el stock de un producto.
 */
export const updateStockMovement = async (payload: InventoryMovementPayload): Promise<void> => {
  await axios.post('/inventory/movements', payload)
}


export const fetchProductMovements = async (productId: number): Promise<InventoryMovementPayload[]> => {
  const response = await axios.get(`/inventory/products/${productId}/movements`);
  return response.data;
};
