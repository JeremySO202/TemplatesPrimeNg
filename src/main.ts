import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsCR from '@angular/common/locales/es-CR';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Registrar locales
registerLocaleData(localeEs);
registerLocaleData(localeEsCR);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
