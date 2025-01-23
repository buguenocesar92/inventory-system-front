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
