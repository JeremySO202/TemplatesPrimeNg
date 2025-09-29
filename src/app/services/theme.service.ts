import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Señal reactiva para el modo del tema
  private _themeMode = signal<ThemeMode>('system');
  private _isDarkMode = signal<boolean>(false);

  // Getters públicos readonly
  public readonly themeMode = this._themeMode.asReadonly();
  public readonly isDarkMode = this._isDarkMode.asReadonly();

  // Media query para detectar preferencia del sistema
  private systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // Cargar tema guardado o usar sistema
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this._themeMode.set(savedTheme);
    }

    // Efecto para aplicar cambios de tema
    effect(() => {
      this.applyTheme();
    });

    // Escuchar cambios en preferencia del sistema
    this.systemPreference.addEventListener('change', () => {
      if (this._themeMode() === 'system') {
        this.updateDarkMode();
      }
    });

    // Aplicar tema inicial
    this.updateDarkMode();
  }

  /**
   * Establece el modo del tema
   */
  setThemeMode(mode: ThemeMode) {
    this._themeMode.set(mode);
    localStorage.setItem('theme-mode', mode);
  }

  /**
   * Alterna entre modo claro y oscuro
   */
  toggleTheme() {
    const currentMode = this._themeMode();
    if (currentMode === 'system') {
      // Si está en sistema, cambiar a lo contrario de la preferencia actual
      this.setThemeMode(this.systemPreference.matches ? 'light' : 'dark');
    } else {
      // Alternar entre light y dark
      this.setThemeMode(currentMode === 'light' ? 'dark' : 'light');
    }
  }

  /**
   * Actualiza el estado de modo oscuro basado en el tema actual
   */
  private updateDarkMode() {
    const themeMode = this._themeMode();
    let isDark = false;

    switch (themeMode) {
      case 'dark':
        isDark = true;
        break;
      case 'light':
        isDark = false;
        break;
      case 'system':
        isDark = this.systemPreference.matches;
        break;
    }

    this._isDarkMode.set(isDark);
  }

  /**
   * Aplica el tema al documento
   */
  private applyTheme() {
    this.updateDarkMode();
    const isDark = this._isDarkMode();

    // Aplicar clase al documento
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Emitir evento personalizado para componentes que lo necesiten
    window.dispatchEvent(
      new CustomEvent('theme-changed', {
        detail: {
          isDarkMode: isDark,
          themeMode: this._themeMode(),
        },
      }),
    );
  }

  /**
   * Obtiene los colores del tema actual para un componente específico
   */
  getThemeColors(componentType: 'chat' | 'form' | 'table' | 'menu') {
    const isDark = this._isDarkMode();

    const themes = {
      chat: {
        light: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-100',
          userMessage: 'bg-blue-500 text-white',
          botMessage: 'bg-white border border-gray-200 text-gray-800',
          headerGradient: 'from-blue-500 to-purple-600',
          background: 'bg-gray-50',
          cardBackground: 'bg-white',
          textPrimary: 'text-gray-800',
          textSecondary: 'text-gray-600',
          border: 'border-gray-200',
          inputBg: 'bg-white',
          inputBorder: 'border-gray-200',
          inputFocus: 'ring-blue-500 border-blue-500',
        },
        dark: {
          primary: 'bg-blue-600',
          secondary: 'bg-gray-800',
          userMessage: 'bg-blue-600 text-white',
          botMessage: 'bg-gray-800 border border-gray-700 text-gray-100',
          headerGradient: 'from-blue-600 to-purple-700',
          background: 'bg-gray-900',
          cardBackground: 'bg-gray-800',
          textPrimary: 'text-gray-100',
          textSecondary: 'text-gray-400',
          border: 'border-gray-700',
          inputBg: 'bg-gray-700',
          inputBorder: 'border-gray-600',
          inputFocus: 'ring-blue-600 border-blue-600',
        },
      },
      form: {
        light: {
          primary: 'bg-indigo-500',
          secondary: 'bg-indigo-50',
          userMessage: 'bg-indigo-500 text-white',
          botMessage: 'bg-white border border-indigo-200 text-gray-800',
          headerGradient: 'from-indigo-500 to-purple-600',
          background: 'bg-gray-50',
          cardBackground: 'bg-white',
          textPrimary: 'text-gray-800',
          textSecondary: 'text-gray-600',
          border: 'border-gray-200',
          inputBg: 'bg-white',
          inputBorder: 'border-gray-200',
          inputFocus: 'ring-indigo-500 border-indigo-500',
        },
        dark: {
          primary: 'bg-indigo-600',
          secondary: 'bg-indigo-900',
          userMessage: 'bg-indigo-600 text-white',
          botMessage: 'bg-gray-800 border border-gray-700 text-gray-100',
          headerGradient: 'from-indigo-600 to-purple-700',
          background: 'bg-gray-900',
          cardBackground: 'bg-gray-800',
          textPrimary: 'text-gray-100',
          textSecondary: 'text-gray-400',
          border: 'border-gray-700',
          inputBg: 'bg-gray-700',
          inputBorder: 'border-gray-600',
          inputFocus: 'ring-indigo-600 border-indigo-600',
        },
      },
      table: {
        light: {
          primary: 'bg-green-500',
          secondary: 'bg-green-50',
          userMessage: 'bg-green-500 text-white',
          botMessage: 'bg-white border border-green-200 text-gray-800',
          headerGradient: 'from-green-500 to-teal-600',
          background: 'bg-gray-50',
          cardBackground: 'bg-white',
          textPrimary: 'text-gray-800',
          textSecondary: 'text-gray-600',
          border: 'border-gray-200',
          inputBg: 'bg-white',
          inputBorder: 'border-gray-200',
          inputFocus: 'ring-green-500 border-green-500',
        },
        dark: {
          primary: 'bg-green-600',
          secondary: 'bg-green-900',
          userMessage: 'bg-green-600 text-white',
          botMessage: 'bg-gray-800 border border-gray-700 text-gray-100',
          headerGradient: 'from-green-600 to-teal-700',
          background: 'bg-gray-900',
          cardBackground: 'bg-gray-800',
          textPrimary: 'text-gray-100',
          textSecondary: 'text-gray-400',
          border: 'border-gray-700',
          inputBg: 'bg-gray-700',
          inputBorder: 'border-gray-600',
          inputFocus: 'ring-green-600 border-green-600',
        },
      },
      menu: {
        light: {
          primary: 'bg-purple-500',
          secondary: 'bg-purple-50',
          userMessage: 'bg-purple-500 text-white',
          botMessage: 'bg-white border border-purple-200 text-gray-800',
          headerGradient: 'from-purple-500 to-indigo-600',
          background: 'bg-gray-50',
          cardBackground: 'bg-white',
          textPrimary: 'text-gray-800',
          textSecondary: 'text-gray-600',
          border: 'border-gray-200',
          inputBg: 'bg-white',
          inputBorder: 'border-gray-200',
          inputFocus: 'ring-purple-500 border-purple-500',
        },
        dark: {
          primary: 'bg-purple-600',
          secondary: 'bg-purple-900',
          userMessage: 'bg-purple-600 text-white',
          botMessage: 'bg-gray-800 border border-gray-700 text-gray-100',
          headerGradient: 'from-purple-600 to-indigo-700',
          background: 'bg-gray-900',
          cardBackground: 'bg-gray-800',
          textPrimary: 'text-gray-100',
          textSecondary: 'text-gray-400',
          border: 'border-gray-700',
          inputBg: 'bg-gray-700',
          inputBorder: 'border-gray-600',
          inputFocus: 'ring-purple-600 border-purple-600',
        },
      },
    };

    return themes[componentType][isDark ? 'dark' : 'light'];
  }

  /**
   * Obtiene iconos apropiados para el tema actual
   */
  getThemeIcons() {
    const themeMode = this._themeMode();
    const isDark = this._isDarkMode();

    return {
      themeToggle: themeMode === 'system' ? 'pi pi-desktop' : isDark ? 'pi pi-moon' : 'pi pi-sun',
      themeLabel: themeMode === 'system' ? 'Sistema' : isDark ? 'Oscuro' : 'Claro',
    };
  }
}
