import { Component } from '@angular/core';
import { Tabla } from '../plantillas/tabla/tabla';
import { Formulario, FormularioData } from '../../../templates/formulario/formulario';
import { Inventario, InventarioItem } from '../services/inventario';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-gestor-inventario',
  imports: [Tabla, Formulario],
  templateUrl: './gestor-inventario.html',
})
export class GestorInventario {
  public items: InventarioItem[] = [];

  // Estado de los formularios
  public showAddDialog = false;
  public showEditDialog = false;
  public selectedItem: InventarioItem | null = null;

  // Configuración de formularios
  public formInputsAdd: FormularioData[] = [
    {
      label: 'Nombre',
      value: '',
      placeholder: 'Ingrese el nombre del producto',
      id: 'nombre',
      type: 'text',
      required: true,
      validators: [Validators.required, Validators.minLength(2)],
    },
    {
      label: 'Cantidad',
      value: 0,
      placeholder: 'Ingrese la cantidad',
      id: 'cantidad',
      type: 'number',
      required: true,
      validators: [Validators.required, Validators.min(0)],
    },
    {
      label: 'Precio',
      value: 0,
      placeholder: 'Ingrese el precio',
      id: 'precio',
      type: 'number',
      required: true,
      validators: [Validators.required, Validators.min(0)],
    },
    {
      label: 'Categoría',
      value: '',
      placeholder: 'Ingrese la categoría',
      id: 'categoria',
      type: 'text',
      required: true,
      validators: [Validators.required],
    },
    {
      label: 'Fecha de Ingreso',
      value: new Date(),
      id: 'fechaIngreso',
      type: 'date',
      required: true,
      validators: [Validators.required],
    },
    {
      label: 'En Stock',
      value: true,
      id: 'enStock',
      type: 'checkbox',
    },
  ];

  public formInputsEdit: FormularioData[] = [...this.formInputsAdd];
  public formDataAdd: any = {};
  public formDataEdit: any = {};

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

  // Métodos CRUD
  onAdd() {
    this.resetFormAdd();
    this.showAddDialog = true;
  }

  onEdit(item: InventarioItem) {
    this.selectedItem = item;
    this.loadFormDataForEdit(item);
    this.showEditDialog = true;
  }

  onDelete(item: InventarioItem) {
    this.inventario.eliminarItem(item.id);
    this.items = this.inventario.obtenerItems();
  }

  // Servicios de formularios
  onSubmitAdd = (formData: any) => {
    const newItem: InventarioItem = {
      id: this.getNextId(),
      nombre: formData.nombre,
      cantidad: formData.cantidad,
      precio: formData.precio,
      categoria: formData.categoria,
      fechaIngreso: formData.fechaIngreso,
      enStock: formData.enStock,
    };

    this.inventario.agregarItem(newItem);
    this.items = this.inventario.obtenerItems();
    this.showAddDialog = false;
  };

  onSubmitEdit = (formData: any) => {
    if (this.selectedItem) {
      const updatedItem: Partial<InventarioItem> = {
        nombre: formData.nombre,
        cantidad: formData.cantidad,
        precio: formData.precio,
        categoria: formData.categoria,
        fechaIngreso: formData.fechaIngreso,
        enStock: formData.enStock,
      };

      this.inventario.actualizarItem(this.selectedItem.id, updatedItem);
      this.items = this.inventario.obtenerItems();
      this.showEditDialog = false;
      this.selectedItem = null;
    }
  };

  // Métodos auxiliares
  private getNextId(): number {
    return Math.max(...this.items.map((item) => item.id), 0) + 1;
  }

  private resetFormAdd() {
    this.formInputsAdd.forEach((input) => {
      switch (input.type) {
        case 'text':
          input.value = '';
          break;
        case 'number':
          input.value = 0;
          break;
        case 'date':
          input.value = new Date();
          break;
        case 'checkbox':
          input.value = true;
          break;
      }
    });
  }

  private loadFormDataForEdit(item: InventarioItem) {
    this.formInputsEdit.forEach((input) => {
      input.value = (item as any)[input.id];
    });
  }
}
