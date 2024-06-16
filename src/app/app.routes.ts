import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Inicio',
    },
    canActivate: [authGuard],
    children: [
      {
        path: 'mantenimientos',
        children: [
          {
            path: 'usuarios',
            loadComponent: () =>
              import(
                './views/pages/mantenimientos/usuarios/usuarios.component'
              ).then((c) => c.UsuariosComponent),
            canActivate: [adminGuard],
            data: {
              title: 'Mantenimiento de Usuarios',
            },
          },
          {
            path: 'empleados',
            loadComponent: () =>
              import(
                './views/pages/mantenimientos/empleados/empleados.component'
              ).then((c) => c.EmpleadosComponent),
            data: {
              title: 'Mantenimiento de Empleados',
            },
          },
          {
            path: 'empleado/:id',
            loadComponent: () =>
              import(
                './views/pages/mantenimientos/empleados/empleado.component'
              ).then((m) => m.EmpleadoComponent),
            data: {
              title: 'Mantenimiento de Empleado',
            },
          },

          {
            path: 'tiendas',
            loadComponent: () =>
              import(
                './views/pages/mantenimientos/tiendas/tiendas.component'
              ).then((c) => c.TiendasComponent),
            data: {
              title: 'Mantenimiento de Tiendas',
            },
          },
        ],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./views/pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./views/pages/perfil/perfil.component').then(
            (c) => c.PerfilComponent
          ),
        data: {
          title: 'Perfil',
        },
      },
      {
        path: 'buscar/:termino',
        loadComponent: () =>
          import('./views/pages/busqueda/busqueda.component').then(
            (c) => c.BusquedaComponent
          ),
        data: {
          title: 'Búsqueda',
        },
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: 'dashboard' },
];
