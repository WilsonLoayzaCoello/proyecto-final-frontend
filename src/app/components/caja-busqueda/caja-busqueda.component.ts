import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableDirective } from '@coreui/angular';
import { freeSet } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-caja-busqueda',
  standalone: true,
  imports: [
    NgIf,
    IconDirective,
    FormsModule,
    ReactiveFormsModule,
    TableDirective,
  ],
  templateUrl: './caja-busqueda.component.html',
  styles: `.search-container {
    display: flex;
    align-items: center;
    position: relative;
  }

  .search-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
  }

  .search-input {
    margin-left: 8px;
    padding: 4px 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
  }

  .search-container.active .search-input {
    display: block;
  }
  `,
})
export class CajaBusquedaComponent {
  private router = inject(Router);
  icons = freeSet;
  isSearchActive = false;
  searchQuery = '';

  // Metodo para activar o desactivar la caja de busqueda
  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  // Metodo para buscar un termino en la barra de busqueda
  buscar(termino: string) {
    if (termino.length === 0) {
      return;
    }
    this.router.navigate(['/buscar', termino]);
  }
}
