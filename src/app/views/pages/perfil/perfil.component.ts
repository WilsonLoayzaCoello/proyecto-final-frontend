import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { FileUploadService } from '../../../services/file-upload.service';
import { CommonModule, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import {
  CardBodyComponent,
  CardComponent,
  ColComponent,
  FormCheckComponent,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    CommonModule,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    FormCheckComponent,
    IconDirective,
  ],
  templateUrl: './perfil.component.html',
  styles: ``,
})
export class PerfilComponent implements OnInit {
  icons = freeSet;
  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);
  private fileUploadSvc = inject(FileUploadService);
  public usuario?: Usuario;
  public imagenSubir: File | undefined;
  public imgTemp?: string;

  // Formulario de perfil
  perfilForm: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
  });
  submitted = false;

  constructor() {
    // Obtener usuario
    this.usuario = this.usuarioService.usuario || {
      imagenUrl: '',
      google: false,
      nombre: '',
      email: '',
    };
  }

  ngOnInit(): void {
    // Inicializar formulario
    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre, Validators.required],
      email: [this.usuario?.email, [Validators.required, Validators.email]],
    });
  }

  // Actualizar perfil
  actualizarPerfil() {
    this.usuarioService.actualizarUsuario(this.perfilForm?.value).subscribe({
      next: (resp) => {
        const { nombre, email } = this.perfilForm?.value;
        this.usuario!.nombre = nombre;
        this.usuario!.email = email;

        Swal.fire('Guardado', 'Cambios guardados correctamente', 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
    this.submitted = true;
  }

  // Cambiar imagen
  cambiarImagen(event: any) {
    const file: File = event.target.files[0];
    this.imagenSubir = file;
    if (!file) {
      return (this.imgTemp = '');
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result as string;
    };
    return null;
  }

  // Subir imagen
  subirImagen() {
    this.fileUploadSvc
      .actualizarFoto(this.imagenSubir!, 'usuarios', this.usuario!.uid || '')
      .then((img) => {
        this.usuario!.img = img;
        Swal.fire('Guardado', 'Imagen actualizada correctamente', 'success');
      })
      .catch((err) => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
