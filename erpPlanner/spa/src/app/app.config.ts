import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { provideHttpClient } from '@angular/common/http';
import { collectionReducer } from './model/state/collection-reducer';
import { booksReducer } from './model/state/book-reducer';
import { StoreModule } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(AngularSlickgridModule.forRoot()),
    importProvidersFrom(
      StoreModule.forRoot({
        books: booksReducer,
        collection: collectionReducer,
      }),
    )
  ],
};
