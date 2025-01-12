import axios from '@/axiosConfig'
import type { ProductPayload } from '@/types/ProductTypes'

export const fetchProducts = async (): Promise<ProductPayload[]> => {
  const response = await axios.get('/products')
  return response.data
}

export const addProduct = async (payload: ProductPayload): Promise<ProductPayload> => {
  const response = await axios.post('/products', payload)
  return response.data
}

export const updateProduct = async (id: number, payload: ProductPayload): Promise<ProductPayload> => {
  const response = await axios.put(`/products/${id}`, payload)
  return response.data
}

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`/products/${id}`)
}
export const fetchProduct = async (id: number): Promise<ProductPayload> => {
  const response = await axios.get(`/products/${id}`)
  return response.data
}
