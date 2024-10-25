import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideSpinnerConfig } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideToastr({
      positionClass: 'toast-top-center',
      closeButton: true,
      timeOut: 3000,
      preventDuplicates:true,
    }),
    provideSpinnerConfig({
      type:'ball-atom'
    }),
    importProvidersFrom([BrowserAnimationsModule])
  ],
};
