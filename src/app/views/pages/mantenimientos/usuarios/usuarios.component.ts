import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { NgFor, NgIf } from '@angular/common';
import { BusquedasService } from 'src/app/services/busquedas.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TableDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { BadgeComponent, TextColorDirective } from '@coreui/angular';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    TableDirective,
    IconDirective,
    TextColorDirective,
    BadgeComponent,
  ],
  templateUrl: './usuarios.component.html',
  styles: ``,
})
export class UsuariosComponent implements OnInit, OnDestroy {
  icons = freeSet;
  private usuarioSvc = inject(UsuarioService);
  private busquedasSvc = inject(BusquedasService);
  private modalImagenSvc = inject(ModalImagenService);
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription = new Subscription();
  public desde: number = 0;
  public cargando: boolean = true;

  ngOnDestroy(): void {
    // Llamado cuando el componente se destruye
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    // Llamado cuando el componente se inicia
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenSvc.nuevaImagen
      .pipe(delay(200))
      .subscribe(() => {
        this.cargarUsuarios();
      });
  }

  // Metodo para cargar usuarios
  cargarUsuarios() {
    this.cargando = true;
    this.usuarioSvc
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  // Metodo para cambiar la pagina en la paginacion de usuarios
  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  // Metodo para buscar usuarios por termino
  buscar(termino: string) {
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedasSvc.buscar('usuarios', termino).subscribe({
      next: (results) => {
        this.usuarios = results as Usuario[];
      },
      error: (error) => {
        console.error('Error al buscar usuarios:', error);
        Swal.fire('Error', 'Ocurrió un error al realizar la búsqueda', 'error');
      },
    });
  }

  // Metodo para eliminar un usuario
  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioSvc.uid) {
      return Swal.fire('Error', 'No puedes borrar tu propio usuario', 'error');
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar a ${usuario.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioSvc.eliminarUsuario(usuario.uid).subscribe(() => {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario eliminado',
            `El usuario ${usuario.nombre} ha sido eliminado`,
            'success'
          );
        });
      }
    });
    return;
  }

  // Metodo para cambiar el role de un usuario
  cambiarRole(usuario: Usuario) {
    this.usuarioSvc.guardarUsuario(usuario).subscribe(() => {
      Swal.fire(
        'Usuario actualizado',
        `El usuario ${usuario.nombre} ha sido actualizado`,
        'success'
      );
    });
  }

  // Metodo para abrir el modal de imagen
  abrirModal(usuario: Usuario) {
    this.modalImagenSvc.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
