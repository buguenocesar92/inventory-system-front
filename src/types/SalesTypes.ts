export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  barcode: string;
  description: string;
  image_url: string;
  current_stock: number;
  reorder_point: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
  category_id: number;
}

export interface Sale {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  cash_register_id: number;
  user: User;
  product: Product;
}

export interface FetchSalesResponse {
  items: Sale[];
  total: number;
}

export interface FetchSalesHistoryParams {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: string }[];
  search: string;
}
