import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'templates/formulario',
        loadComponent: () =>
          import('./templates/formulario/implementacion-formulario/implementacion-formulario').then(
            (m) => m.ImplementacionFormulario,
          ),
      },
      {
        path: 'templates/tabla',
        loadComponent: () =>
          import('./templates/tabla/implementacion-tabla/implementacion-tabla').then(
            (m) => m.ImplementacionTabla,
          ),
      },
      {
        path: 'templates/menuizquierda',
        loadComponent: () =>
          import(
            './templates/menu-izquierda/implementacion-menu-izquierda/implementacion-menu-izquierda'
          ).then((m) => m.ImplementacionMenuIzquierda),
      },
      {
        path: 'crud/gestor-inventario',
        loadComponent: () =>
          import('./examples/CRUD/gestor-inventario/gestor-inventario').then(
            (m) => m.GestorInventario,
          ),
      },
    ],
  },
];
