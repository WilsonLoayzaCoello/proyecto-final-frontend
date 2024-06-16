import { Usuario } from '../models/usuario.model';

// Interfaces para el servicio de cargar usuarios
export interface CargarUsuariosResponse {
  total: number;
  usuarios: Usuario[];
}
