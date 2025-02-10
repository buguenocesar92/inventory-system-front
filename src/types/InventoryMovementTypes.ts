export interface InventoryMovementPayload {
  product_id: string | number
  movement_type: 'entry' | 'exit' | 'transfer'
  quantity: number
  description: string
}
