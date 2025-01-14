import axios from '@/axiosConfig';

// Registrar una venta
export const registerSale = async (payload: { items: { product_id: number; quantity: number }[] }) => {
  const response = await axios.post('/sales', payload);
  return response.data;
};
