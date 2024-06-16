import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  {
    name: 'PERSONAL',
    title: true,
  },
  {
    name: 'Mantenimientos',
    url: '/mantenimientos',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Usuarios',
        url: '/mantenimientos/usuarios',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Empleados',
        url: '/mantenimientos/empleados',
        icon: 'nav-icon-bullet',
      },

      {
        name: 'Tiendas',
        url: '/mantenimientos/tiendas',
        icon: 'nav-icon-bullet',
      },
    ],
  },
];
