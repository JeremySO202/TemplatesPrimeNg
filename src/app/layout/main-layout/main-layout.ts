import { Component } from '@angular/core';
import { MenuIzquierda } from '../../templates/menu-izquierda/menu-izquierda';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  imports: [MenuIzquierda, RouterOutlet],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Usos',
      },
      {
        label: 'Templates Dinamicos',
        items: [
          {
            label: 'Tabla',
            icon: 'pi pi-fw pi-table',
            routerLink: '/templates/tabla',
          },
          {
            label: 'Formulario',
            icon: 'pi pi-fw pi-pencil',
            routerLink: '/templates/formulario',
          },
          {
            label: 'Menu Izquierda',
            icon: 'pi pi-fw pi-list',
            routerLink: '/templates/menuizquierda',
          },
        ],
      },
    ];
  }
}
