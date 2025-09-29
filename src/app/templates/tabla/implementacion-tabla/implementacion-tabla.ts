import { Component } from '@angular/core';
import { Tabla } from '../tabla';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-implementacion-tabla',
  standalone: true,
  imports: [CommonModule, Tabla, ButtonModule, TooltipModule],
  templateUrl: './implementacion-tabla.html',
})
export class ImplementacionTabla {
  constructor(public themeService: ThemeService) {}

  data = [
    { id: 1, name: 'Item 1', value: 100, date: new Date() },
    { id: 2, name: 'Item 2', value: 200, date: new Date() },
    { id: 3, name: 'Item 3', value: 300, date: new Date() },
  ];

  columns = [
    { header: 'ID', field: 'id', type: 'number', width: '20%' },
    { header: 'Name', field: 'name', type: 'text', width: '40%' },
    { header: 'Value', field: 'value', type: 'number', width: '20%' },
    {
      header: 'Date',
      field: 'date',
      type: 'date',
      width: '20%',
      alternativeDisplay: "{{ rowData.date | date: 'short' }}",
    },
  ];

  /**
   * Obtiene la información de iconos basada en el tema actual
   */
  getCurrentThemeInfo() {
    return this.themeService.getThemeIcons();
  }

  /**
   * Alterna entre los modos de tema
   */
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
