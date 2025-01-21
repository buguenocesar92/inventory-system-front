// src/types/ProductTypes.ts

/**
 * Representa los campos básicos de un producto en el sistema.
 */
export interface BaseProduct {
  name: string;
  category: string;
  brand: string;
  barcode: string;
  description: string;
  image_url: string;
  unit_price: number;
}

/**
 * Producto que recibimos del backend (ya contiene 'id').
 */
export interface Product extends BaseProduct {
  id: number;
}

/**
 * Payload para crear/actualizar un producto.
 * - 'id' es opcional si lo estás creando por primera vez.
 */
export interface ProductPayload {
  id?: number;
  name: string;
  category: string;
  brand: string;
  barcode: string;
  description: string;
  image_url: string;
  unit_price: number;
}

/**
 * Respuesta de la API al paginar productos.
 */
export interface FetchProductsResponse {
  items: Product[];
  total: number;
}

/**
 * Producto seleccionado (ej. en un carrito o POS),
 * extiende 'Product' y agrega la propiedad 'quantity'.
 */
export interface SelectedProduct extends Product {
  quantity: number;
}
