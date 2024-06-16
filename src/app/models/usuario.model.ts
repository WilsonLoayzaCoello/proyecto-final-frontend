import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

// Modelo de Usuario
export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: 'ADMIN_ROLE' | 'USER_ROLE',
    public uid?: string
  ) {}

  // Metodo para obtener la imagen del usuario
  get imagenUrl() {
    if (!this.img) {
      return `${baseUrl}/upload/usuarios/no-image`;
    } else if (this.img && this.img.includes('https')) {
      return this.img;
    } else if (this.img) {
      return `${baseUrl}/upload/usuarios/${this.img}`;
    } else {
      return `${baseUrl}/upload/usuarios/no-image`;
    }
  }
}
