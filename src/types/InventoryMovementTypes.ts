export interface InventoryMovementPayload {
  product_id: string | number
  movement_type: 'entry' | 'exit' | 'adjustment'
  quantity: number
  description: string
  location_id: number
}
