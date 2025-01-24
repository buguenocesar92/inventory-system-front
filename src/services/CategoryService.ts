// src/services/CategoryService.ts
import axios from '@/axiosConfig';
import type { CategoryPayload } from '@/types/CategoryTypes';

/**
 * Obtiene todas las categorías.
 */
export async function fetchCategories(): Promise<CategoryPayload[]> {
  const response = await axios.get('/categories');
  return response.data;
}

/**
 * Elimina una categoría
 */
export async function deleteCategory(id: number): Promise<void> {
  await axios.delete(`/categories/${id}`);
}

/**
 * Crea una nueva categoría
 */
export async function createCategory(data: CategoryPayload): Promise<CategoryPayload> {
  const response = await axios.post('/categories', data);
  return response.data;
}

/**
 * Actualiza una categoría existente
 */
export async function updateCategory(id: number, data: CategoryPayload): Promise<CategoryPayload> {
  const response = await axios.put(`/categories/${id}`, data);
  return response.data;
}
