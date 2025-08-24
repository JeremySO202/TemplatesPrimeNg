import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';

export interface FormularioData {
  label: string; // Etiqueta del campo
  value: any; // Valor del campo
  placeholder?: string; // Placeholder para el campo
  id: string; // Identificador único del campo
  type: string; // Tipo de campo (text, email, checkbox, date)
  required?: boolean; // Indica si el campo es obligatorio
  validators?: ValidatorFn[]; // Array de funciones de validación
  customValidation?: (value: any) => string | null; // Función de validación personalizada
}

@Component({
  selector: 'formulario-dinamico',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    KnobModule,
    DatePickerModule,
    ToastModule,
  ],
  templateUrl: './formulario.html',
})
export class Formulario implements OnInit {
  // Configuraciones del formulario
  /**
   * Título del formulario.
   * Se muestra en la parte superior del formulario.
   */
  @Input() public formTitle?: string = '';

  /**
   * Función que se llama al enviar el formulario.
   * Recibe los datos del formulario como argumento.
   */
  @Input() public onSubmitService?: (formData: { [key: string]: any }) => void = () => {
    console.log('No se ha proporcionado un servicio para enviar los datos');
  };

  /**
   * Etiqueta del botón para enviar el formulario.
   */
  @Input() public submitButtonLabel?: string = '';

  /**
   * Etiqueta del botón para resetear el formulario.
   */
  @Input() public resetButtonLabel?: string = '';

  /**
   * Etiqueta del botón para cancelar el formulario.
   */
  @Input() public cancelButtonLabel?: string = '';

  /**
   * Ancho del diálogo del formulario.
   */
  @Input() public dialogWidth: string = '500px';

  /**
   * Alto del diálogo del formulario.
   */
  @Input() public dialogHeight: string = 'auto';

  /**
   * Indica si el diálogo del formulario está visible.
   */
  @Input() public displayDialog: boolean = false;

  /**
   * Evento que se emite cuando se quiere cambiar la visibilidad del diálogo
   */
  @Output() public displayDialogChange = new EventEmitter<boolean>();

  /**
   * Lista de campos que se mostrarán en el formulario.
   */
  @Input() public formInputs: FormularioData[] = [];

  /**
   * Objeto que contiene los datos del formulario.
   * Se actualiza automáticamente al cambiar los valores de los campos.
   */
  @Input() public formData: { [key: string]: any } = {};

  /**
   * Objeto que contiene los datos del formulario.
   * Se actualiza automáticamente al cambiar los valores de los campos.
   */
  @Output() public formDataChange = new EventEmitter<{ [key: string]: any }>();

  //Datos a mostrar en el formulario

  dynamicForm!: FormGroup; // Formulario reactivo

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createDynamicForm();
  }

  createDynamicForm() {
    const formControls: { [key: string]: any } = {};

    this.formInputs.forEach((input) => {
      // Combinar validadores built-in con los personalizados
      const validators = input.validators || [];

      formControls[input.id] = [input.value, validators];
      this.formData[input.id] = input.value; // Inicializar formData con los valores
      this.formDataChange.emit(this.formData);
    });

    this.dynamicForm = this.fb.group(formControls);

    // Sincronizar cambios del formulario con formData
    this.dynamicForm.valueChanges.subscribe((values) => {
      this.formData = { ...values };
      this.formDataChange.emit(this.formData);
      // También actualizar los valores en formInputs para mantener sincronización
      this.formInputs.forEach((input) => {
        if (values.hasOwnProperty(input.id)) {
          input.value = values[input.id];
        }
      });
    });
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.dynamicForm.valid) {
      this.showCurrentData();
      if (this.onSubmitService){
        this.onSubmitService(this.formData);
      }
      // Emitir evento para cerrar el diálogo
      this.displayDialogChange.emit(false);
    } else {
      console.log('Formulario inválido');
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.dynamicForm.controls).forEach((key) => {
      const control = this.dynamicForm.get(key);
      control?.markAsTouched();
    });
  }

  resetForm() {
    this.dynamicForm.reset();
    this.formInputs.forEach((input) => {
      input.value = input.type === 'checkbox' ? false : '';
    });
    this.formData = {};
  }

  // Método para mostrar los datos actuales
  showCurrentData() {
    console.log('Datos actuales en formData:', this.formData);
    console.log('Datos actuales en inputs:', this.formInputs);
  }

  // Métodos para validación
  getFieldError(fieldId: string): string | null {
    const control = this.dynamicForm.get(fieldId);
    const input = this.formInputs.find((inp) => inp.id === fieldId);

    if (control && control.errors && (control.dirty || control.touched)) {
      // Primero verificar validaciones personalizadas
      if (input?.customValidation) {
        const customError = input.customValidation(control.value);
        if (customError) return customError;
      }

      // Validaciones built-in
      if (control.errors['required']) return `${input?.label} es requerido`;
      if (control.errors['email']) return 'Email no válido';
      if (control.errors['minlength'])
        return `${input?.label} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['invalidPhone']) return 'Formato de teléfono inválido';
      if (control.errors['invalidAge']) return 'La edad debe estar entre 18 y 120 años';
      if (control.errors['tooShort']) return 'El nombre de la empresa es muy corto';
      if (control.errors['requiredTrue']) return 'Debe aceptar los términos y condiciones';
    }

    return null;
  }

  isFieldInvalid(fieldId: string): boolean {
    const control = this.dynamicForm.get(fieldId);
    return !!(control && control.errors && (control.dirty || control.touched));
  }

  isFieldValid(fieldId: string): boolean {
    const control = this.dynamicForm.get(fieldId);
    return !!(control && control.valid && (control.dirty || control.touched));
  }



}
