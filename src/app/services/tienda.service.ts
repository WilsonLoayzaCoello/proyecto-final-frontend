import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Tienda } from '../models/tienda.model';
import { CargarTiendasResponse } from '../interfaces/cargar-tiendas.interface';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class TiendaService {
  private http = inject(HttpClient);
  private storageSvc = inject(StorageService);
  public usuario?: Usuario;

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

  // Metodo para cargar las tiendas
  cargarTiendas() {
    const url = `${base_url}/tiendas`;
    return this.http
      .get<CargarTiendasResponse>(url, this.headers)
      .pipe(map((resp: { ok: boolean; tiendas: Tienda[] }) => resp.tiendas));
  }

  // Metodo para crear una tienda
  crearTienda(nombre: string) {
    const url = `${base_url}/tiendas`;
    return this.http.post(url, { nombre }, this.headers);
  }

  // Metodo para actualizar una tienda
  actualizarTienda(_id: string, nombre: string) {
    const url = `${base_url}/tiendas/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  // Metodo para eliminar una tienda
  eliminarTienda(_id: string) {
    const url = `${base_url}/tiendas/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
