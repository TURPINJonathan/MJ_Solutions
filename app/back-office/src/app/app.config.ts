import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
		provideHttpClient(),
		provideAnimations(),
		provideToastr(),
    provideRouter(routes),
		importProvidersFrom(
			CommonModule,
			FormsModule,
      ToastrModule.forRoot({
        tapToDismiss: true,
        closeButton: true,
        newestOnTop: true,
        progressBar: true,
        progressAnimation: 'increasing',
        timeOut: 5000,
        extendedTimeOut: 1000,
        disableTimeOut: false,
        maxOpened: 4,
        easeTime: 300,
        positionClass: 'toast-top-right'
      }),
		)
  ]
};
