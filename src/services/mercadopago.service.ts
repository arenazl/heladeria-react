/**
 * Este archivo se mantiene para compatibilidad con el código existente.
 * Todos los métodos relacionados con Mercado Pago han sido movidos al servicio de menú comensal,
 * que es donde deberían estar lógicamente ya que interactúan con los endpoints de MenuCommensal.
 */

import { mercadoPagoService as mpService } from './menu-commensal.service';

// Re-exportar los métodos del servicio de menú comensal para mantener compatibilidad
export const createPreference = mpService.createPreference;
export const getOrderById = mpService.getOrderById;

// Exportar el objeto de servicio para mantener compatibilidad
export const mercadoPagoService = mpService;
