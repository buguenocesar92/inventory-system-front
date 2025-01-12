import axios from '@/axiosConfig'
import type { InventoryMovementPayload } from '@/types/InventoryMovementTypes'


export const updateStockMovement = async (payload: InventoryMovementPayload): Promise<void> => {
  await axios.post('/inventory/movements', payload)
}
