import axios from '@/axiosConfig';
import type { ProductPayload, FetchProductsResponse } from '@/types/ProductTypes';

// Obtener productos con paginación, búsqueda y ordenamiento
export const fetchProducts = async ({
  page,
  itemsPerPage,
  sortBy,
  search,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: string }[];
  search: string;
}): Promise<FetchProductsResponse> => {
  const response = await axios.get('/products', {
    params: { page, itemsPerPage, sortBy, search },
  });

  return {
    items: response.data.items, // Productos desde el backend
    total: response.data.total, // Total de productos desde el backend
  };
};

// Agregar un producto
export const addProduct = async (payload: ProductPayload): Promise<ProductPayload> => {
  const response = await axios.post('/products', payload);
  return response.data;
};

// Actualizar un producto
export const updateProduct = async (id: number, payload: ProductPayload): Promise<ProductPayload> => {
  const response = await axios.put(`/products/${id}`, payload);
  return response.data;
};

// Eliminar un producto
export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`/products/${id}`);
};

// Obtener un producto por ID
export const fetchProduct = async (id: number): Promise<ProductPayload> => {
  const response = await axios.get(`/products/${id}`);
  return response.data;
};

// Obtener un producto por código de barras
export const fetchProductByBarcode = async (barcode: string): Promise<ProductPayload> => {
  const response = await axios.get(`/products/barcode/${barcode}`);
  return response.data;
};
