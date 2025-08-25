import { Routes } from '@angular/router';
import { ImplementacionFormulario } from './templates/formulario/implementacion-formulario/implementacion-formulario';
import { ImplementacionTabla } from './templates/tabla/implementacion-tabla/implementacion-tabla';
// import { TestComponent } from './test.component';

export const routes: Routes = [
  { path: 'templates/formulario', component: ImplementacionFormulario },
  { path: 'templates/tabla', component: ImplementacionTabla },
];
