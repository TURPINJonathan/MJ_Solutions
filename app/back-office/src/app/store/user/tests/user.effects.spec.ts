import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { UserEffects } from '../user.effects';
import * as UserActions from '../user.actions';
import { AuthService } from '#services/auth/auth.service';
import { User } from '#SModels/user.model';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshUser']);

    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    effects = TestBed.inject(UserEffects);
  });

  it('should dispatch loadUserSuccess on refreshUser success', (done) => {
    const user: User = {
      id: '1',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'ROLE_USER',
			createdAt: new Date(),
    };
    spyOn(localStorage, 'getItem').and.callFake((key: string) => key === 'refreshToken' ? 'token' : null);
    authServiceSpy.refreshUser.and.returnValue(of({ token: 'abc', user }));

    actions$ = of(UserActions.loadUser());

    effects.loadUser$.subscribe(action => {
      expect(action).toEqual(UserActions.loadUserSuccess({ user }));
      done();
    });
  });

  it('should dispatch loadUserFailure on refreshUser error', (done) => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => key === 'refreshToken' ? 'token' : null);
    authServiceSpy.refreshUser.and.returnValue(throwError(() => new Error('fail')));

    actions$ = of(UserActions.loadUser());

    effects.loadUser$.subscribe(action => {
      expect(action.type).toBe(UserActions.loadUserFailure.type);
      done();
    });
  });

  it('should dispatch loadUserFailure if no refreshToken', (done) => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    actions$ = of(UserActions.loadUser());

    effects.loadUser$.subscribe(action => {
      expect(action.type).toBe(UserActions.loadUserFailure.type);
      done();
    });
  });
});