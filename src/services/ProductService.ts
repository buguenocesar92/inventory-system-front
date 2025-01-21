// src/services/ProductService.ts
import axios from '@/axiosConfig';
import type {
  Product,
  ProductPayload,
  FetchProductsResponse
} from '@/types/ProductTypes';

/**
 * Parámetros para filtrar, paginar y buscar productos.
 */
interface FetchProductsParams {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: string }[];
  search: string;
}

/**
 * Obtener productos con paginación, búsqueda y ordenamiento.
 */
export async function fetchProducts({
  page,
  itemsPerPage,
  sortBy,
  search,
}: FetchProductsParams): Promise<FetchProductsResponse> {
  const response = await axios.get('/products', {
    params: { page, itemsPerPage, sortBy, search },
  });
  return {
    items: response.data.items,
    total: response.data.total,
  };
}

/**
 * Agregar un producto.
 * Retorna el producto creado con 'id' asignado por la API.
 */
export async function addProduct(payload: ProductPayload): Promise<Product> {
  const response = await axios.post('/products', payload);
  return response.data;
}

/**
 * Actualizar un producto existente.
 */
export async function updateProduct(id: number, payload: ProductPayload): Promise<Product> {
  const response = await axios.put(`/products/${id}`, payload);
  return response.data;
}

/**
 * Eliminar un producto por 'id'.
 */
export async function deleteProduct(id: number): Promise<void> {
  await axios.delete(`/products/${id}`);
}

/**
 * Obtener un producto por 'id'.
 */
export async function fetchProduct(id: number): Promise<Product> {
  const response = await axios.get(`/products/${id}`);
  return response.data;
}

/**
 * Obtener un producto por código de barras.
 */
export async function fetchProductByBarcode(barcode: string): Promise<Product> {
  const response = await axios.get(`/products/barcode/${barcode}`);
  return response.data;
}
