import axios from '@/axiosConfig'
import type { ProductPayload } from '@/types/ProductTypes'

// Obtener la lista de productos
export const fetchProducts = async (): Promise<ProductPayload[]> => {
  const response = await axios.get('/products')
  return response.data
}

// Agregar un nuevo producto
export const addProduct = async (payload: ProductPayload): Promise<ProductPayload> => {
  const response = await axios.post('/products', payload)
  return response.data
}

// Actualizar un producto existente
export const updateProduct = async (id: number, payload: ProductPayload): Promise<ProductPayload> => {
  const response = await axios.put(`/products/${id}`, payload)
  return response.data
}

// Eliminar un producto por ID
export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`/products/${id}`)
}
