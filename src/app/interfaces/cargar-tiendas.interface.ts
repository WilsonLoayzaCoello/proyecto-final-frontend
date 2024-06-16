import { Tienda } from '../models/tienda.model';

// Interfaces para el servicio de cargar tiendas
export interface CargarTiendasResponse {
  ok: boolean;
  tiendas: Tienda[];
}
