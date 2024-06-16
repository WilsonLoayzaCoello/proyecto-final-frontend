import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PipesModule } from '../../../../pipes/pipes.module';
import { ImagenPipe } from '../../../../pipes/imagen.pipe';
import {
  FormCheckComponent,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormSelectDirective,
  InputGroupComponent,
  InputGroupTextDirective,
} from '@coreui/angular';
import { freeSet } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { Tienda } from 'src/app/models/tienda.model';
import { TiendaService } from 'src/app/services/tienda.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado } from 'src/app/models/empleado.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [
    InputGroupComponent,
    FormControlDirective,
    FormCheckLabelDirective,
    FormDirective,
    InputGroupTextDirective,
    FormCheckComponent,
    FormSelectDirective,
    IconDirective,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    PipesModule,
    ImagenPipe,
  ],
  templateUrl: './empleado.component.html',
  styles: ``,
})
export class EmpleadoComponent implements OnInit {
  icons = freeSet;
  public empleadoForm: FormGroup = new FormGroup({});
  public tiendas: Tienda[] = [];
  public tiendaSeleccionada: Tienda | undefined;
  public empleadoSeleccionado: Empleado | undefined;
  private fb = inject(FormBuilder);
  private tiendasSvc = inject(TiendaService);
  private empleadoSvc = inject(EmpleadoService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // Obtener el id del empleado
    this.activatedRoute.params.subscribe(({ id }) => this.cargarEmpleado(id));

    // Inicializar el formulario
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      tienda: ['', Validators.required],
    });
    this.cargarTiendas();

    // Escuchar cambios en el select de tiendas
    this.empleadoForm.get('tienda')?.valueChanges.subscribe({
      next: (tiendaId) => {
        this.tiendaSeleccionada = this.tiendas.find(
          (tienda) => tienda._id === tiendaId
        );
      },
      error: (error) => {
        console.error('Error al cambiar el valor de la tienda', error);
      },
    });
  }

  // Metodo para cargar un empleado
  cargarEmpleado(id: string) {
    if (id === 'nuevo') {
      return;
    }
    this.empleadoSvc.cargarEmpleadoPorId(id).subscribe((empleado) => {
      if (!empleado) {
        return this.router.navigateByUrl('/mantenimientos/empleados');
      }
      const { nombre, tienda: _id } = empleado;

      this.empleadoSeleccionado = empleado;
      this.empleadoForm.patchValue({ nombre, tienda: _id?._id });
      return;
    });
  }

  // Metodo para cargar las tiendas
  cargarTiendas() {
    this.tiendasSvc.cargarTiendas().subscribe({
      next: (tiendas: Tienda[]) => {
        this.tiendas = tiendas;
      },
      error: (error) => {
        console.error('Error al cargar las tiendas', error);
      },
    });
  }

  // Metodo para guardar un empleado
  guardarEmpleado() {
    if (this.empleadoForm.invalid) {
      return;
    }
    const { nombre } = this.empleadoForm.value;
    if (this.empleadoSeleccionado) {
      const data = {
        ...this.empleadoForm.value,
        _id: this.empleadoSeleccionado._id,
      };
      this.empleadoSvc.actualizarEmpleado(data).subscribe((resp) => {
        Swal.fire(
          'Empleado actualizado',
          `El empleado ${nombre} ha sido actualizado`,
          'success'
        );
        this.router.navigateByUrl(`/mantenimientos/empleado/${data._id}`);
      });
    } else {
      this.empleadoSvc.crearEmpleado(this.empleadoForm.value).subscribe({
        next: (resp: any) => {
          Swal.fire(
            'Empleado creado',
            `El empleado ${nombre} ha sido creado`,
            'success'
          );
          this.router.navigateByUrl(
            `/mantenimientos/empleado/${resp.empleado._id}`
          );
        },
        error: (error) => {
          Swal.fire(
            'Error',
            `Ocurrió un error al crear el empleado ${nombre}`,
            'error'
          );
        },
      });
    }
  }
}
