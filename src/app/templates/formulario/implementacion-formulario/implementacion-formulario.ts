import { Component } from '@angular/core';
import { Formulario } from '../formulario';
import { AbstractControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-implementacion-formulario',
  imports: [Formulario, ButtonModule],
  templateUrl: './implementacion-formulario.html',
})
export class ImplementacionFormulario {
  // Configuración del formulario
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

  displayDialog: boolean = false;

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
      validators: [Validators.required, ImplementacionFormulario.ageValidator],
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
      validators: [ImplementacionFormulario.phoneValidator],
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
      validators: [ImplementacionFormulario.companyValidator],
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

  formData: { [key: string]: any } = {};

  // Método para alternar la visibilidad del diálogo
  public toggleDialog() {
    this.displayDialog = !this.displayDialog;
  }

  // Método para mostrar los datos actuales
  showCurrentData() {
    console.log('Datos actuales en formData:', this.formData);
    console.log('Datos actuales en inputs:', this.formInputs);
  }

  onSubmit(formData: { [key: string]: any }) {
    console.log('Datos enviados:', formData);
  }
}
