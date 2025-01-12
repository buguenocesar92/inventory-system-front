export interface Product {
  id: number
  name: string
}


export interface ProductPayload {
  id?: number
  name: string
  category: string
  brand: string
  barcode: string
  description: string
  image_url: string
/*   current_stock: number
  reorder_point: number */
  unit_price: number
}


export interface FetchProductsResponse {
  items: ProductPayload[];
  total: number;
}
