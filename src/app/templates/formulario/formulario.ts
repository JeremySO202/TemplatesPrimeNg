import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
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
  selector: 'app-formulario',
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
  // Validadores personalizados
  private static phoneValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const phoneRegex = /^(\+?[0-9]{1,4}\-)?[0-9]{8}$/;
    return phoneRegex.test(value) ? null : { invalidPhone: true };
  }

  private static ageValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const age = parseInt(value);
    if (age < 18 || age > 120) {
      return { invalidAge: true };
    }
    return null;
  }

  private static companyValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    if (value.length < 2) {
      return { tooShort: true };
    }
    return null;
  }

  //Datos a mostrar en el formulario
  formInputs: any[] = [
    {
      label: 'Nombre',
      value: 'Juan',
      id: 'name',
      type: 'text',
      required: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
      ],
      customValidation: (value: string) => {
        if (!value) return 'El nombre es requerido';
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
        return null;
      },
    },
    {
      label: 'Edad',
      value: '',
      id: 'ages',
      type: 'number',
      required: true,
      validators: [Validators.required, Formulario.ageValidator],
      customValidation: (value: number) => {
        if (!value) return 'La edad es requerida';
        if (value < 18) return 'Debe ser mayor de 18 años';
        if (value > 120) return 'Edad no válida';
        return null;
      },
    },
    {
      label: 'Fecha de Nacimiento',
      value: '',
      id: 'birthdate',
      type: 'date',
      required: true,
      validators: [Validators.required],
      customValidation: (value: Date) => {
        if (!value) return 'La fecha de nacimiento es requerida';
        return null;
      },
    },
    {
      label: 'Email',
      value: '',
      placeholder: 'johndoe@mail.com',
      id: 'email',
      type: 'email',
      required: true,
      validators: [Validators.required, Validators.email],
      customValidation: (value: string) => {
        if (!value) return 'El email es requerido';
        if (!Validators.email({ value } as AbstractControl)) return null;
        return 'Email no válido';
      },
    },
    {
      label: 'Teléfono',
      value: '',
      id: 'phone',
      type: 'text',
      required: false,
      validators: [Formulario.phoneValidator],
      customValidation: (value: string) => {
        if (!value) return null; // Opcional
        if (!/^(\+?[0-9]{1,4})?[0-9]{9,10}$/.test(value)) return 'Formato de teléfono inválido';
        return null;
      },
    },
    {
      label: 'Empresa',
      value: '',
      id: 'company',
      type: 'text',
      required: false,
      validators: [Formulario.companyValidator],
      customValidation: (value: string) => {
        if (!value) return null; // Opcional
        if (value.length < 2) return 'El nombre de la empresa debe tener al menos 2 caracteres';
        return null;
      },
    },
    {
      label: 'Acepto términos',
      value: false,
      id: 'acceptTerms',
      type: 'checkbox',
      required: true,
      validators: [Validators.requiredTrue],
      customValidation: (value: boolean) => {
        if (!value) return 'Debe aceptar los términos y condiciones';
        return null;
      },
    },
  ];

  dynamicForm!: FormGroup; // Formulario reactivo
  displayDialog: boolean = false; // Controla la visibilidad del diálogo

  // Objeto donde se almacenarán los valores del formulario
  formData: { [key: string]: any } = {};

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
    });

    this.dynamicForm = this.fb.group(formControls);

    // Sincronizar cambios del formulario con formData
    this.dynamicForm.valueChanges.subscribe((values) => {
      this.formData = { ...values };
      // También actualizar los valores en formInputs para mantener sincronización
      this.formInputs.forEach((input) => {
        if (values.hasOwnProperty(input.id)) {
          input.value = values[input.id];
        }
      });
    });
  }

  toggleDialog() {
    this.displayDialog = !this.displayDialog;
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.dynamicForm.valid) {
      this.showCurrentData();
      // Aquí puedes enviar los datos a un servicio
      this.displayDialog = false; // Cerrar el diálogo después de enviar
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

  porcentComplete(): number {
    const totalFields = this.formInputs.length;
    const validFields = this.formInputs.filter((input) => this.isFieldValid(input.id)).length;
    return totalFields ? (validFields / totalFields) * 100 : 0;
  }

  isFieldInvalid(fieldId: string): boolean {
    const control = this.dynamicForm.get(fieldId);
    return !!(control && control.errors && (control.dirty || control.touched));
  }

  isFieldValid(fieldId: string): boolean {
    const control = this.dynamicForm.get(fieldId);
    return !!(control && control.valid && (control.dirty || control.touched));
  }

  // Método para obtener un resumen de validación
  getValidationSummary(): { valid: boolean; errors: string[]; validFields: string[] } {
    const errors: string[] = [];
    const validFields: string[] = [];

    this.formInputs.forEach((input) => {
      const error = this.getFieldError(input.id);
      if (error) {
        errors.push(error);
      } else if (this.isFieldValid(input.id)) {
        validFields.push(input.label);
      }
    });

    return {
      valid: errors.length === 0 && this.dynamicForm.valid,
      errors,
      validFields,
    };
  }

  // Método para verificar si el formulario tiene errores
  hasErrors(): boolean {
    return !this.dynamicForm.valid && this.dynamicForm.touched;
  }
}
