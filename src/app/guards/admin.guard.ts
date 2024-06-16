import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const adminGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  // Si el usuario es administrador, puede acceder a la página
  if (usuarioService.role === 'ADMIN_ROLE') {
    return true;
  }
  Swal.fire('Error', 'No tienes permisos para acceder a esta página', 'error');

  // Si el usuario no es administrador, se redirige a la página de dashboard
  router.navigateByUrl('/dashboard');
  return false;
};
