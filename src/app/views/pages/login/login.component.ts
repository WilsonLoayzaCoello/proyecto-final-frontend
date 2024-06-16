declare const google: any;

import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  FormCheckInputDirective,
  FormCheckComponent,
} from '@coreui/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``,
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    FormCheckComponent,
    NgStyle,
    RouterLink,
  ],
})
export class LoginComponent implements AfterViewInit {
  private usuarioSvc = inject(UsuarioService);
  private storageSvc = inject(StorageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef;
  public formSubmited = false;
  // private googleInitialized = false;

  // Formulario de login
  public loginForm = this.fb.nonNullable.group({
    email: [
      this.storageSvc.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [false],
  });
  constructor() {
    if (
      isPlatformBrowser(this.platformId) &&
      this.storageSvc.getItem('email')
    ) {
      this.loginForm.patchValue({
        email: this.storageSvc.getItem('email') || '',
      });
    }
  }

  ngAfterViewInit(): void {
    // Inicializar Google Sign-In
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleScript()
        .then(() => {
          this.googleInit();
        })
        .catch((err) => {
          console.error('Error loading Google script:', err);
        });
    }
  }

  // Metodo para cargar el script de Google
  loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('google-jssdk');
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-jssdk';
      script.onload = () => {
        resolve();
      };
      script.onerror = (err) => {
        reject(err);
      };

      document.body.appendChild(script);
    });
  }

  // Metodo para inicializar Google Sign-In
  async googleInit() {
    await google.accounts.id.initialize({
      client_id:
        '742972783567-sktgukohtmsu6m2obmr4irbjbu484cq3.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    // this.googleInitialized = true;
    google.accounts.id.renderButton(this.googleBtn!.nativeElement, {
      theme: 'outline',
      size: 'large',
    });
    google.accounts.id.prompt();
  }

  // Metodo para manejar la respuesta de Google
  handleCredentialResponse(response: any) {
    this.usuarioSvc.loginGoogle(response.credential).subscribe({
      next: (resp) => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/dashboard');
        });
      },
      error: (err) => {
        console.log(err.error.msg);
      },
    });
  }

  // Metodo para hacer login con credenciales normales
  login() {
    const loginData = <LoginForm>this.loginForm.value;

    this.usuarioSvc.loginNoGoogle(loginData).subscribe({
      next: (resp) => {
        if (isPlatformBrowser(this.platformId)) {
          if (this.loginForm.get('remember')?.value) {
            const emailValue = loginData.email;
            if (emailValue !== null && emailValue !== undefined) {
              this.storageSvc.setItem('email', emailValue);
            }
            this.storageSvc.setItem('remember', 'true');
          } else {
            this.storageSvc.removeItem('email');
            this.storageSvc.setItem('remember', 'false');
          }
          this.router.navigateByUrl('/dashboard');
        }
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
  }
}
