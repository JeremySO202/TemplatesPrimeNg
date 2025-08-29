import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'menu-izquierda-dinamico',
  imports: [MenuModule, BadgeModule, RippleModule, RouterModule, CommonModule],
  templateUrl: './menu-izquierda.html',
})
export class MenuIzquierda implements OnInit {
  /**
   * Título del menú que aparece en la parte superior
   */
  @Input() public menuTitle?: string = 'PRIME<span class="text-primary">APP</span>';

  /**
   * Contenido HTML del footer que aparece en la parte inferior
   */
  @Input() public footerContent?: string = '';

  /**
   * Items del menú que se mostrarán
   */
  @Input() public menuItems: MenuItem[] = [];

  /**
   * Ancho del menú
   */
  @Input() public menuWidth: string = 'w-full md:w-60';

  // Propiedades del componente
  public items: MenuItem[] = [];

  ngOnInit() {
    // Si no se proporcionan items externos, usar los por defecto
    this.items = this.menuItems.length > 0 ? this.menuItems : this.getDefaultItems();
  }

  /**
   * Maneja el click en un item del menú
   * @param event - Evento del click
   * @param item - Item del menú clickeado
   */
  itemClick(event: Event, item: MenuItem) {
    // Si tiene routerLink, la navegación es automática
    // Solo ejecutar command si existe
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    // Si tiene URL externa, manejar la navegación
    if (item.url && !item.routerLink) {
      if (item.target === '_blank') {
        window.open(item.url, '_blank');
      } else {
        window.location.href = item.url;
      }
      event.preventDefault();
    }
  }

  private getDefaultItems(): MenuItem[] {
    return [
      {
        separator: true,
      },
      {
        label: 'Documents',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
            shortcut: '⌘+N',
          },
          {
            label: 'Search',
            icon: 'pi pi-search',
            shortcut: '⌘+S',
          },
        ],
      },
      { separator: true },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            shortcut: '⌘+O',
          },
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q',
          },
        ],
      },
      {
        separator: true,
      },
    ];
  }
}
