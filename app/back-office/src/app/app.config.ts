import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { UserEffects } from '#store/user/user.effects';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { reducers } from './store';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    provideStore(reducers),
    provideEffects([UserEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
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
		),
	]
};
