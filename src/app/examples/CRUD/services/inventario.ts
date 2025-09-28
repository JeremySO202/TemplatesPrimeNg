import { Injectable } from '@angular/core';

export interface InventarioItem {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  categoria: string;
  fechaIngreso: Date;
  enStock: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Inventario {
  private items: InventarioItem[] = [];

  cargarDatosIniciales() {
    this.items = [
      {
        id: 1,
        nombre: 'Laptop',
        cantidad: 5,
        precio: 350000,
        categoria: 'Electrónicos',
        fechaIngreso: new Date('2023-01-15'),
        enStock: true,
      },
      {
        id: 2,
        nombre: 'Smartphone',
        cantidad: 10,
        precio: 200000,
        categoria: 'Electrónicos',
        fechaIngreso: new Date('2023-02-20'),
        enStock: true,
      },
      {
        id: 3,
        nombre: 'Escritorio',
        cantidad: 2,
        precio: 120000,
        categoria: 'Muebles',
        fechaIngreso: new Date('2023-03-05'),
        enStock: true,
      },
      {
        id: 4,
        nombre: 'Silla de Oficina',
        cantidad: 0,
        precio: 80000,
        categoria: 'Muebles',
        fechaIngreso: new Date('2023-01-25'),
        enStock: false,
      },
      {
        id: 5,
        nombre: 'Monitor',
        cantidad: 7,
        precio: 120000,
        categoria: 'Electrónicos',
        fechaIngreso: new Date('2023-02-10'),
        enStock: true,
      },
    ];

    return this.items;
  }

  agregarItem(item: InventarioItem) {
    this.items.push(item);
    return this.items;
  }

  obtenerItems(): InventarioItem[] {
    return [...this.items];
  }

  eliminarItem(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
    return this.items;
  }

  actualizarItem(id: number, updatedItem: Partial<InventarioItem>) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updatedItem };
    }
    return this.items;
  }
}
