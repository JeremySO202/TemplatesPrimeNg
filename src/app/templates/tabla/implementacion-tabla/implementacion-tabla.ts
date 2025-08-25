import { Component } from '@angular/core';
import { Tabla } from '../tabla';
import { header } from '@primeuix/themes/aura/accordion';

@Component({
  selector: 'app-implementacion-tabla',
  imports: [Tabla],
  templateUrl: './implementacion-tabla.html',
})
export class ImplementacionTabla {
  data = [
    { id: 1, name: 'Item 1', value: 100, date: new Date() },
    { id: 2, name: 'Item 2', value: 200, date: new Date() },
    { id: 3, name: 'Item 3', value: 300, date: new Date() },
  ];

  columns = [
    { header: 'ID', field: 'id', type: 'number', width: '20%' },
    { header: 'Name', field: 'name', type: 'text', width: '40%' },
    { header: 'Value', field: 'value', type: 'number', width: '20%' },
    { header: 'Date', field: 'date', type: 'date', width: '20%', alternativeDisplay: "{{ rowData.date | date: 'short' }}" },
  ];
}
