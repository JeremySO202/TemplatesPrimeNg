import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

export interface TablaColumns {
  header: string; // Etiqueta de la columna
  field: string; // Campo de datos
  type: string; // Tipo de dato (text, number, date, boolean, etc.)
  notDisplay?: boolean; // Indica si la columna no se debe mostrar
  notSortable?: boolean; // Indica si la columna no es ordenable
  notFilterable?: boolean; // Indica si la columna no es filtrable
  width?: string; // Ancho de la columna
  alternativeDisplay?: string; // Plantilla alternativa para mostrar el dato
}

@Component({
  selector: 'tabla-CRUD',
  imports: [TableModule, CommonModule],
  templateUrl: './tabla.html',
})
export class Tabla {
  // Configuraciones del formulario

  /**
   * Título de la tabla
   * Se utiliza para mostrar el encabezado de la tabla
   */
  @Input() public tableTitle?: string = '';

  /**
   * Datos a mostrar en la tabla
   * Se utiliza para mostrar las filas de la tabla
   */
  @Input() public tableData: any[] = [];
  /**
   * Configuración de las columnas de la tabla
   * Se utiliza para definir las columnas que se mostrarán en la tabla
   */
  @Input() public tableColumns: TablaColumns[] = [];
  /**
   * LLave primaria
   */
  @Input() public primaryKey: string = '';
  /**
   * Indica si se debe mostrar el paginador
   */
  @Input() public paginator: boolean = true;
  /**
   * Cantidad de elementos por página
   */
  @Input() public rowsPerPage: number = 10;
  /**
   * Indica si se debe mostrar la barra de búsqueda
   */
  @Input() public showSearch: boolean = true;
}
