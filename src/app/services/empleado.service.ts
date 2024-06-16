import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  CargarEmpleadoResponse,
  CargarEmpleadosResponse,
} from '../interfaces/cargar-empleados.interface';
import { map } from 'rxjs/operators';
import { Empleado } from '../models/empleado.model';
import { StorageService } from './storage.service';
import { Usuario } from '../models/usuario.model';

// URL base de la API
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private storageSvc = inject(StorageService);
  public usuario?: Usuario;

  constructor() {}

  // Metodo para obtener el token del usuario
  get token(): string {
    return this.storageSvc.getItem('token') || '';
  }

  // Metodo para obtener el uid del usuario
  get uid(): string {
    return this.usuario?.uid || '';
  }

  // Metodo para obtener los headers de la peticion
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  // Metodo para cargar los empleados
  cargarEmpleados() {
    const url = `${base_url}/empleados`;
    return this.http
      .get<CargarEmpleadosResponse>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean; empleados: Empleado[] }) => resp.empleados)
      );
  }

  // Metodo para cargar un empleado por su ID
  cargarEmpleadoPorId(id: string) {
    const url = `${base_url}/empleados/${id}`;
    return this.http
      .get<CargarEmpleadoResponse>(url, this.headers)
      .pipe(map((resp: { ok: boolean; empleado: Empleado }) => resp.empleado));
  }

  // Metodo para crear un empleado
  crearEmpleado(empleado: { nombre: string; tienda: string }) {
    const url = `${base_url}/empleados`;
    return this.http.post(url, empleado, this.headers);
  }

  // Metodo para actualizar un empleado
  actualizarEmpleado(empleado: Empleado) {
    const url = `${base_url}/empleados/${empleado._id}`;
    return this.http.put(url, empleado, this.headers);
  }

  // Metodo para eliminar un empleado
  eliminarEmpleado(_id: string) {
    const url = `${base_url}/empleados/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
