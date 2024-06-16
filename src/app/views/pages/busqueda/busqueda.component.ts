import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlertComponent, TableDirective } from '@coreui/angular';
import { Empleado } from 'src/app/models/empleado.model';
import { Tienda } from 'src/app/models/tienda.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ImagenPipe } from 'src/app/pipes/imagen.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [
    AlertComponent,
    TableDirective,
    NgIf,
    NgFor,
    PipesModule,
    ImagenPipe,
    RouterLink,
  ],
  templateUrl: './busqueda.component.html',
  styles: ``,
})
export class BusquedaComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private busquedasSvc = inject(BusquedasService);
  public usuarios: Usuario[] = [];
  public tiendas: Tienda[] = [];
  public empleados: Empleado[] = [];

  ngOnInit(): void {
    // Obtener el termino de busqueda
    this.activatedRoute.params.subscribe(({ termino }) =>
      this.busquedaGlobal(termino)
    );
  }

  // Metodo para realizar una busqueda global
  busquedaGlobal(termino: string) {
    this.busquedasSvc.busquedaGlobal(termino).subscribe((resp: any) => {
      this.usuarios = resp.usuarios;
      this.tiendas = resp.tiendas;
      this.empleados = resp.empleados;
    });
  }
}
