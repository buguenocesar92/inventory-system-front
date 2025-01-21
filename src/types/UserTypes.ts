// src/types/UserTypes.ts

/**
 * Datos requeridos para registrar un usuario.
 */
export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

/**
 * Representa un usuario existente en el sistema.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  // En algunos casos puede no ser recomendable exponer el password,
  // pero aquí se incluye tal como lo definiste:
  password: string;
}
