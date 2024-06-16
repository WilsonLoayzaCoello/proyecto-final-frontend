import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private localStorageSvc = inject(StorageService);
  public menu: any[];

  // Metodo para guardar el menu en el localStorage
  cargarMenu() {
    const menuString = this.localStorageSvc.getItem('menu');
    this.menu = menuString ? JSON.parse(menuString) : [];
  }

  // menu: any[] = [
  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'ti-folder',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios' },
  //       { titulo: 'Empresas', url: 'empresas' },
  //       { titulo: 'Empleados', url: 'empleados' },
  //     ],
  //   },
  // ];
}
