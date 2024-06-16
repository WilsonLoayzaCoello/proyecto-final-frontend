import { Tienda } from './tienda.model';
interface _EmpleadoUser {
  _id: string;
  nombre: string;
  img: string;
}

// Modelo de empleado
export class Empleado {
  constructor(
    public nombre: string,
    public _id?: string,
    public img?: string,
    public usuario?: _EmpleadoUser,
    public tienda?: Tienda
  ) {}
}
