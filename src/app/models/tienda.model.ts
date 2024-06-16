interface _TiendaUser {
  _id: string;
  nombre: string;
  img: string;
}

// Modelo de tienda
export class Tienda {
  constructor(
    public nombre: string,
    public _id?: string,
    public img?: string,
    public usuario?: _TiendaUser
  ) {}
}
