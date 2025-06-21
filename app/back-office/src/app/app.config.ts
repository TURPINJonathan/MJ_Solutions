import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/akwaytenpo/assets/i18n/', '.json');
}

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
			TranslateModule.forRoot({
				defaultLanguage: 'fr',
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			})
		)
  ]
};
