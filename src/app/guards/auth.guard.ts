import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const usuarioSvc = inject(UsuarioService);
  const router = inject(Router);

  // Validar si el token del usuario es correcto y si no, redirigir al login
  return usuarioSvc.validarToken().pipe(
    tap((estaAutenticado) => {
      if (!estaAutenticado) {
        router.navigateByUrl('/login');
      }
    })
  );
};
