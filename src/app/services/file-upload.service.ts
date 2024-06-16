import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private storageSvc = inject(StorageService);

  // Metodo para actualizar la foto de un usuario, empleado o tienda
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'empleados' | 'tiendas',
    id: string
  ) {
    try {
      const url = `${baseUrl}/upload/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.storageSvc.getItem('token') || '',
        },
        body: formData,
      });
      const data = await resp.json();

      if (data.ok) {
        return data.nombreArchivo;
      } else {
        throw new Error(data.msg);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
