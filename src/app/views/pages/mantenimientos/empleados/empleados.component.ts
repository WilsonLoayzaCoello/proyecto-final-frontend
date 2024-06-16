import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';
import { IconDirective } from '@coreui/icons-angular';
import { TableDirective } from '@coreui/angular';
import { PipesModule } from '../../../../pipes/pipes.module';
import { ImagenPipe } from '../../../../pipes/imagen.pipe';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { freeSet } from '@coreui/icons';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empleados',
  standalone: true,
  templateUrl: './empleados.component.html',
  styles: ``,
  imports: [
    NgIf,
    NgFor,
    ImagenPipe,
    PipesModule,
    IconDirective,
    TableDirective,
    RouterLink,
  ],
})
export class EmpleadosComponent implements OnInit, OnDestroy {
  icons = freeSet;
  private empleadoSvc = inject(EmpleadoService);
  private modalImagenSvc = inject(ModalImagenService);
  private busquedasSvc = inject(BusquedasService);
  private imgSubs: Subscription = new Subscription();
  public empleados: Empleado[] = [];
  public cargando: boolean = true;

  ngOnDestroy(): void {
    // Llamado cuando el componente se destruye
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    // Llamado cuando el componente se inicia
    this.cargarEmpleados();
    this.imgSubs = this.imgSubs = this.modalImagenSvc.nuevaImagen
      .pipe(delay(200))
      .subscribe(() => {
        this.cargarEmpleados();
      });
  }

  // Metodo para buscar empleados por término
  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarEmpleados();
    }
    this.busquedasSvc.buscar('empleados', termino).subscribe((results) => {
      this.empleados = results;
    });
    return;
  }

  // Metodo para cargar los empleados
  cargarEmpleados() {
    this.cargando = true;
    this.empleadoSvc.cargarEmpleados().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        Swal.fire('Error', 'Ocurrió un error al cargar los empleados', 'error');
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false; // En caso de que quieras hacer algo cuando se complete la carga, incluso sin errores
      },
    });
  }

  // Metodo para abrir el modal de imagen
  abrirModal(empleado: Empleado) {
    this.modalImagenSvc.abrirModal('empleados', empleado._id, empleado.img);
  }

  // Metodo para eliminar un empleado
  eliminarEmpleado(empleado: Empleado) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar a ${empleado.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#primary',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadoSvc.eliminarEmpleado(empleado._id!).subscribe(() => {
          Swal.fire('Eliminado', 'Empleado eliminado correctamente', 'success');
          this.cargarEmpleados();
        });
      }
    });
  }
}
