import { Component, inject } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { NgIf } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  standalone: true,
  imports: [NgIf],
  templateUrl: './modal-imagen.component.html',
  styles: ``,
})
export class ModalImagenComponent {
  public modalImagenSvc = inject(ModalImagenService);
  public fileUploadSvc = inject(FileUploadService);
  public imagenSubir: File | undefined;
  public imgTemp: string = '';

  // Metodo para cerrar el modal
  cerrarModal() {
    this.imgTemp = null as any as string;
    this.modalImagenSvc.cerrarModal();
  }

  // Metodo para cambiar la imagen seleccionada
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

  // Metodo para subir una imagen al servidor
  subirImagen() {
    const id = this.modalImagenSvc.id;
    const tipo = this.modalImagenSvc.tipo;
    this.fileUploadSvc
      .actualizarFoto(this.imagenSubir!, tipo, id)
      .then((img) => {
        Swal.fire('Guardado', 'Imagen actualizada correctamente', 'success');
        this.modalImagenSvc.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
