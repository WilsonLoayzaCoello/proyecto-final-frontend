import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private _ocultarModal: boolean = true;
  public tipo: 'usuarios' | 'empleados' | 'tiendas' = 'usuarios';
  public id: string = '';
  public img: string = '';

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  // Metodo para obtener la URL de la imagen
  get ocultarModal(): boolean {
    return this._ocultarModal;
  }

  // Metodo para abrir el modal de la imagen
  abrirModal(
    tipo: 'usuarios' | 'empleados' | 'tiendas',
    id: string = 'no-id',
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${baseUrl}/upload/${tipo}/${img}`;
    }
  }

  // Metodo para cerrar el modal de la imagen
  cerrarModal() {
    this._ocultarModal = true;
  }
}
