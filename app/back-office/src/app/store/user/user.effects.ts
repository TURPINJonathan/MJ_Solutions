import { AuthService } from '#services/auth/auth.service';
import * as UserActions from '#store/user/user.actions';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class UserEffects {
	actions$ = inject(Actions);
	authService = inject(AuthService);
	
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(() => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          return this.authService.refreshUser(refreshToken).pipe(
            map(res => {
              localStorage.setItem('token', res.token);
              return UserActions.loadUserSuccess({ user: res.user });
            }),
            catchError(error => of(UserActions.loadUserFailure({ error })))
          );
        }
        return of(UserActions.loadUserFailure({ error: 'No refreshToken' }));
      })
    )
  );
}