// src/types/ProductTypes.ts

/**
 * Representa los campos básicos de un producto en el sistema.
 */
export interface BaseProduct {
  name: string;
  brand: string;
  barcode: string;
  description: string;
  image_url: string;
  unit_price: number;
}

/**
 * Producto que recibimos o mostramos (por ejemplo, ya con id).
 */
export interface Product extends BaseProduct {
  id: number;
  // category: string | CategoryPayload (dependiendo de tu backend)
}

/**
 * Payload para crear/actualizar un producto en el backend.
 * - 'id' es opcional si se crea por primera vez.
 */
export interface ProductPayload {
  id?: number;
  name: string;
  category_id: number | string;
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
  items: Product[]; // o bien ProductPayload[], según tu caso
  total: number;
}

/**
 * Producto seleccionado (ej. en un carrito o POS),
 * extiende 'Product' y agrega la propiedad 'quantity'.
 */
export interface SelectedProduct extends Product {
  quantity: number;
}

export interface Product {

  id: number;

  name: string;

  category_id: number | string;

  brand: string;

  barcode: string;

  description: string;

  image_url: string;

  unit_price: number;

}
