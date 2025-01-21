// src/services/InventoryMovementService.ts
import axios from '@/axiosConfig'
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes'

/**
 * Envía una solicitud al backend para actualizar el stock de un producto.
 */
export const updateStockMovement = async (payload: InventoryMovementPayload): Promise<void> => {
  await axios.post('/inventory/movements', payload)
}


