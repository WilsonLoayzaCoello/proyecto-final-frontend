import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { Tienda } from 'src/app/models/tienda.model';
import { TiendaService } from 'src/app/services/tienda.service';
import { PipesModule } from '../../../../pipes/pipes.module';
import { ImagenPipe } from '../../../../pipes/imagen.pipe';
import { freeSet } from '@coreui/icons';
import { TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-tiendas',
  standalone: true,
  templateUrl: './tiendas.component.html',
  styles: ``,
  imports: [
    IconDirective,
    TableDirective,
    NgIf,
    NgFor,
    FormsModule,
    PipesModule,
    ImagenPipe,
  ],
})
export class TiendasComponent implements OnInit, OnDestroy {
  icons = freeSet;
  private tiendaSvc = inject(TiendaService);
  private busquedasSvc = inject(BusquedasService);
  private modalImagenSvc = inject(ModalImagenService);
  private imgSubs: Subscription = new Subscription();
  public tiendas: Tienda[] = [];
  public cargando: boolean = true;

  ngOnDestroy(): void {
    // Llamado cuando el componente se destruye
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    // Llamado cuando el componente se inicia
    this.cargarTiendas();
    this.imgSubs = this.imgSubs = this.modalImagenSvc.nuevaImagen
      .pipe(delay(200))
      .subscribe(() => {
        this.cargarTiendas();
      });
  }

  // Metodo para buscar tiendas por término
  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarTiendas();
    }
    this.busquedasSvc.buscar('tiendas', termino).subscribe((results) => {
      this.tiendas = results;
    });
    return;
  }

  // Metodo para cargar las tiendas
  cargarTiendas() {
    this.cargando = true;
    this.tiendaSvc.cargarTiendas().subscribe((tiendas) => {
      this.tiendas = tiendas;
      this.cargando = false;
    });
  }

  // Metodo para guardar una tienda
  guardarTienda(tienda: Tienda) {
    if (tienda._id && tienda.nombre) {
      this.tiendaSvc.actualizarTienda(tienda._id, tienda.nombre).subscribe({
        next: (resp) => {
          Swal.fire(
            'Guardado',
            `Tienda ${tienda.nombre} actualizada`,
            'success'
          );
        },
        error: (error) => {
          Swal.fire(
            'Error',
            'Ocurrió un error al actualizar la tienda',
            'error'
          );
        },
      });
    } else {
      Swal.fire(
        'Error',
        'Debe ingresar el ID y el nombre de la tienda',
        'error'
      );
    }
  }

  // Metodo para eliminar una tienda
  eliminarTienda(tienda: Tienda) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar la tienda ${tienda.nombre}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tiendaSvc.eliminarTienda(tienda._id!).subscribe({
          next: (resp) => {
            Swal.fire(
              'Eliminado',
              `Tienda ${tienda.nombre} eliminada`,
              'success'
            );
            this.cargarTiendas();
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la tienda',
              'error'
            );
          },
        });
      }
    });
  }

  // Metodo para crear una tienda nueva
  async crearTienda() {
    const { value } = await Swal.fire<string>({
      title: 'Crear tienda',
      input: 'text',
      inputLabel: 'Nombre de la tienda',
      inputPlaceholder: 'Ingresa el nombre de la tienda',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (nombre) => {
        return this.tiendaSvc.crearTienda(nombre).subscribe({
          next: (resp) => {
            Swal.fire('Creada', `Tienda ${nombre} creada con éxito`, 'success');
            this.cargarTiendas();
          },
          error: (error) => {
            Swal.fire('Error', 'Ocurrió un error al crear la tienda', 'error');
          },
        });
      },
    });
  }

  // Metodo para abrir el modal de imagen
  abrirModal(tienda: Tienda) {
    this.modalImagenSvc.abrirModal('tiendas', tienda._id, tienda.img);
  }
}
