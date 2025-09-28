import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

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
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
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

  // Eventos CRUD
  @Output() public onAdd = new EventEmitter<void>();
  @Output() public onEdit = new EventEmitter<any>();
  @Output() public onDelete = new EventEmitter<any>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  // Métodos CRUD
  addItem() {
    this.onAdd.emit();
  }

  editItem(rowData: any) {
    this.onEdit.emit(rowData);
  }

  deleteItem(rowData: any) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar este elemento?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.onDelete.emit(rowData);
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmado',
          detail: 'Elemento eliminado exitosamente',
        });
      },
    });
  }
}
