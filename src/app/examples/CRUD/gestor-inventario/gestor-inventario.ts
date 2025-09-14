import { Component } from '@angular/core';
import { Tabla } from '../plantillas/tabla/tabla';
import { Inventario, InventarioItem } from '../services/inventario';

@Component({
  selector: 'app-gestor-inventario',
  imports: [Tabla],
  templateUrl: './gestor-inventario.html',
})
export class GestorInventario {
  public items: InventarioItem[] = [];

  columns = [
    { header: 'ID', field: 'id', type: 'number', width: '10%' },
    { header: 'Nombre', field: 'nombre', type: 'text', width: '25%' },
    { header: 'Cantidad', field: 'cantidad', type: 'number', width: '15%' },
    { header: 'Precio', field: 'precio', type: 'currency', width: '15%' },
    { header: 'Categoría', field: 'categoria', type: 'text', width: '20%' },
    {
      header: 'Fecha de Ingreso',
      field: 'fechaIngreso',
      type: 'date',
      width: '25%',
    },
    {
      header: 'En Stock',
      field: 'enStock',
      type: 'boolean',
      width: '10%',
    },
  ];

  constructor(private inventario: Inventario) {
    this.items = this.inventario.cargarDatosIniciales();
  }
}
