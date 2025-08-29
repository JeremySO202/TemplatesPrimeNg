import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuIzquierda } from '../menu-izquierda';

@Component({
  selector: 'app-implementacion-menu-izquierda',
  imports: [MenuIzquierda],
  templateUrl: './implementacion-menu-izquierda.html',
})
export class ImplementacionMenuIzquierda {
  // Título personalizado del menú
  customMenuTitle = 'MI<span class="text-primary">APP</span>';

  // Footer personalizado del menú
  customFooterContent = `
    <div class="text-center">
      <p class="text-sm text-gray-600 mb-1">© 2025 Mi Empresa</p>
      <p class="text-xs text-gray-500">Versión 1.0.0</p>
    </div>
  `;

  // Configuración del menú
  menuItems: MenuItem[] = [
    {
      separator: true,
    },
    {
      label: 'Navegación',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: '/',
          shortcut: 'Ctrl+H',
        },
        {
          label: 'Formularios',
          icon: 'pi pi-file-edit',
          routerLink: '/formularios',
          shortcut: 'Ctrl+F',
        },
        {
          label: 'Tablas',
          icon: 'pi pi-table',
          routerLink: '/tablas',
          shortcut: 'Ctrl+T',
        },
      ],
    },
    { separator: true },
    {
      label: 'Gestión',
      items: [
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          routerLink: '/usuarios',
          shortcut: 'Ctrl+U',
        },
        {
          label: 'Productos',
          icon: 'pi pi-box',
          routerLink: '/productos',
          shortcut: 'Ctrl+P',
        },
        {
          label: 'Reportes',
          icon: 'pi pi-chart-bar',
          routerLink: '/reportes',
          badge: '3',
        },
      ],
    },
    { separator: true },
    {
      label: 'Enlaces Externos',
      items: [
        {
          label: 'PrimeNG Docs',
          icon: 'pi pi-external-link',
          url: 'https://primeng.org/',
          target: '_blank',
        },
        {
          label: 'Angular Docs',
          icon: 'pi pi-book',
          url: 'https://angular.dev/',
          target: '_blank',
        },
      ],
    },
    { separator: true },
    {
      label: 'Configuración',
      items: [
        {
          label: 'Preferencias',
          icon: 'pi pi-cog',
          command: (event) => {
            console.log('Abriendo Preferencias', event);
          },
        },
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-sign-out',
          command: (event) => {
            console.log('Cerrando sesión', event);
            // Aquí puedes agregar la lógica de logout
          },
        },
      ],
    },
  ];

  // Información del usuario
  userInfo = {
    name: 'Juan Pérez',
    role: 'Desarrollador',
    avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
  };

  // Función para manejar click en el perfil
  onUserProfileClick() {
    console.log('Click en perfil del usuario:', this.userInfo.name);
    // Aquí puedes agregar lógica para mostrar menú de usuario, etc.
  }
}
