import axios from '@/axiosConfig';
import type { FetchSalesHistoryParams, FetchSalesResponse } from '@/types/SalesTypes';

// Registrar una venta
export const registerSale = async (payload: { items: { product_id: number; quantity: number }[] }) => {
  const response = await axios.post('/sales', payload);
  return response.data;
};

export async function fetchSalesHistory({
  page,
  itemsPerPage,
  sortBy,
  search,
}: FetchSalesHistoryParams): Promise<FetchSalesResponse> {
  const response = await axios.get('/reports/sales-history', {
    params: { page, itemsPerPage, sortBy, search },
  });
  return {
    items: response.data.items,
    total: response.data.total,
  };
}
