import axios from 'axios'
import type { InventoryMovementPayload } from '@/types/InventoryTypes'

export const fetchProducts = () => {
  return axios.get('/api/products', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
}

export const createInventoryMovement = (payload: InventoryMovementPayload) => {
  return axios.post('/api/inventory/movements', payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })
}
