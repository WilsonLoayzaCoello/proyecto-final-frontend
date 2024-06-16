declare const google: any;
const base_url = environment.baseUrl;

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { StorageService } from './storage.service';
import { CargarUsuariosResponse } from '../interfaces/cargar-usuarios.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private storageSvc = inject(StorageService);
  public usuario?: Usuario;

  // Metodo para obtener el token del usuario
  get token(): string {
    return this.storageSvc.getItem('token') || '';
  }

  // Metodo para obtener el role del usuario
  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario?.role || 'USER_ROLE';
  }

  // Metodo para obtener el uid del usuario
  get uid(): string {
    return this.usuario?.uid || '';
  }

  // Metodo para obtener los headers de la peticion
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  // Metodo para configurar el token y el menu en el local storage
  guardarLocalStorage(token: string, menu: any) {
    this.storageSvc.setItem('token', token);
    this.storageSvc.setItem('menu', JSON.stringify(menu));
  }

  // Metodo para inicializar Google Auth2
  // private initializeGoogleAuth(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     if (
  //       typeof google !== 'undefined' &&
  //       google.accounts &&
  //       google.accounts.id
  //     ) {
  //       resolve();
  //     } else {
  //       console.error('Google Auth2 no ha sido inicializado');
  //       reject('Google Auth2 no ha sido inicializado');
  //     }
  //   });
  // }

  // Metodo para renovar el token del usuario
  validarToken(): Observable<boolean> {
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          const { email, google, nombre, role, img = '', uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
          this.guardarLocalStorage(resp.token, resp.menu);
          return true;
        }),
        // map((resp: any) => true),
        catchError((error) => of(false))
      );
  }

  // Metodo para crear un usuario
  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  // Metodo para actualizar un usuario
  actualizarUsuario(formData: {
    email: string;
    nombre: string;
    role: string | undefined;
  }) {
    formData = { ...formData, role: this.usuario?.role };
    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      formData,
      this.headers
    );
  }

  // Metodo para el login de un usuario sin Google
  loginNoGoogle(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  // Metodo para el login de un usuario con Google
  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  // Metodo para hacer logout
  async logout() {
    this.storageSvc.removeItem('token');
    this.storageSvc.removeItem('menu');

    if (!this.usuario?.google) {
      this.router.navigateByUrl('/login');
      return;
    } else {
      // await this.initializeGoogleAuth();
      const email = this.usuario.email;
      if (!email) {
        console.error('No se pudo obtener el email del usuario');
        return;
      } else {
        this.cargarUsuarios();
        google.accounts.id.revoke(email, () => {
          this.ngZone.run(() => {
            // delay(12000);
            this.router.navigateByUrl('/login');
            return;
          });
        });
      }
    }
  }

  // Metodo para cargar los usuarios
  cargarUsuarios(desde: number = 0) {
    return this.http
      .get<CargarUsuariosResponse>(
        `${base_url}/usuarios?desde=${desde}`,
        this.headers
      )
      .pipe(
        map((resp) => {
          const usuarios = resp.usuarios.map(
            (usuario) =>
              new Usuario(
                usuario.nombre,
                usuario.email,
                '',
                usuario.img,
                usuario.google,
                usuario.role,
                usuario.uid
              )
          );
          return {
            total: resp.total,
            usuarios,
          };
        })
      );
  }

  // Metodo para eliminar un usuario por su ID
  eliminarUsuario(uid: string | undefined) {
    return this.http.delete(`${base_url}/usuarios/${uid}`, this.headers);
  }

  // Metodo para guardar un usuario
  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }
}
