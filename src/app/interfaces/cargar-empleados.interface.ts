import { Empleado } from '../models/empleado.model';

// Interfaces para el servicio de cargar empleados
export interface CargarEmpleadosResponse {
  ok: boolean;
  empleados: Empleado[];
}

// Interfaces para el servicio de cargar un empleado
export interface CargarEmpleadoResponse {
  ok: boolean;
  empleado: Empleado;
}
