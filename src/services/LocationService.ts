import axios from '@/axiosConfig';
import type { LocationPayload } from '@/types/LocationTypes';

/**
 * Obtiene todos los locales.
 */
export async function fetchLocations(): Promise<LocationPayload[]> {
  const response = await axios.get('/locations');
  return response.data;
}

/**
 * Obtiene un local por ID.
 */
export async function fetchLocationById(id: number): Promise<LocationPayload> {
  const response = await axios.get(`/locations/${id}`);
  return response.data;
}

/**
 * Elimina un local.
 */
export async function deleteLocation(id: number): Promise<void> {
  await axios.delete(`/locations/${id}`);
}

/**
 * Crea un nuevo local.
 */
export async function createLocation(data: LocationPayload): Promise<LocationPayload> {
  const response = await axios.post('/locations', data);
  return response.data;
}

/**
 * Actualiza un local existente.
 */
export async function updateLocation(id: number, data: LocationPayload): Promise<LocationPayload> {
  const response = await axios.put(`/locations/${id}`, data);
  return response.data;
}
