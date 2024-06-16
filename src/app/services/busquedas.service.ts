import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Tienda } from '../models/tienda.model';
import { Empleado } from '../models/empleado.model';
import { StorageService } from './storage.service';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  private http = inject(HttpClient);
  private localStorageSvc = inject(StorageService);

  // Metodo para obtener el token del usuario
  get token(): string {
    return this.localStorageSvc.getItem('token') || '';
  }

  // Metodo para obtener los headers de la peticion
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  // Metodo para transformar los resultados de la busqueda de usuarios
  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      (user) =>
        new Usuario(
          user.nombre,
          user.email,
          '',
          user.img,
          user.google,
          user.role,
          user.uid
        )
    );
  }

  // Metodo para transformar los resultados de la busqueda de tiendas
  private transformarTiendas(resultados: any[]): Tienda[] {
    return resultados;
  }

  // Metodo para transformar los resultados de la busqueda de empleados
  private transformarEmpleados(resultados: any[]): Empleado[] {
    return resultados;
  }

  // Metodo para realizar una busqueda global de usuarios, empleados y tiendas
  busquedaGlobal(termino: string) {
    const url = `${baseUrl}/todo/${termino}`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp) => {
        return {
          usuarios: this.transformarUsuarios(resp.usuarios),
          empleados: this.transformarEmpleados(resp.empleados),
          tiendas: this.transformarTiendas(resp.tiendas),
        };
      })
    );
  }

  // Metodo para buscar usuarios, empleados o tiendas por termino
  buscar(tipo: 'usuarios' | 'empleados' | 'tiendas', termino: string) {
    const url = `${baseUrl}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(resp.resultados);
          case 'empleados':
            return this.transformarEmpleados(resp.resultados);
          case 'tiendas':
            return this.transformarTiendas(resp.resultados);
          default:
            return [];
        }
      })
    );
  }
}
