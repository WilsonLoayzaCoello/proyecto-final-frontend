import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;

@Pipe({
  name: 'imagen',
  standalone: true,
})
export class ImagenPipe implements PipeTransform {
  // Metodo para transformar la imagen de un usuario, empleado o tienda a una URL
  transform(img: string, tipo: 'usuarios' | 'empleados' | 'tiendas'): string {
    if (!img) {
      return `${baseUrl}/upload/usuarios/no-image`;
    } else if (img && img.includes('https')) {
      return img;
    } else if (img) {
      return `${baseUrl}/upload/${tipo}/${img}`;
    } else {
      return `${baseUrl}/upload/usuarios/no-image`;
    }
  }
}
