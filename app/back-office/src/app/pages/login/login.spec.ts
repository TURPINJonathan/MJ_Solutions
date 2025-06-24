import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

import { LoginPage } from './login';
import { AuthService } from '#services/auth/auth.service';
import { ToastUtils } from '#utils/toastUtils';
import { InputComponent } from '#common/ui/input/input';
import { ButtonComponent } from '#common/ui/button/button';
import { CardComponent } from '#common/ui/card/card';
import { FormComponent } from '#common/ui/form/form';
import { LanguageSwitcherComponent } from '#common/ui/language-switcher/language-switcher';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let component: LoginPage;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastSpy: jasmine.SpyObj<ToastUtils>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastSpy = jasmine.createSpyObj('ToastUtils', ['success', 'error', 'warning']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginPage,
        FormsModule,
        InputComponent,
        ButtonComponent,
        CardComponent,
        FormComponent,
        LanguageSwitcherComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastUtils, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
        provideMockStore({})
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login page', () => {
    expect(component).toBeTruthy();
  });

  it('should render the login form', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.login-container')).toBeTruthy();
  });

  it('should disable the submit button if fields are invalid', () => {
    component.email = '';
    component.password = '';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('should enable the submit button if fields are valid', () => {
    component.email = 'user@example.com';
    component.password = 'ValidPassword123!';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeFalse();
  });

  it('should show a warning toast if fields are empty', () => {
    component.email = '';
    component.password = '';
    component.onSubmit(new Event('submit'));
    expect(toastSpy.warning).toHaveBeenCalled();
  });

  it('should call AuthService.login on submit with valid fields', () => {
    component.email = 'user@example.com';
    component.password = 'ValidPassword123!';
    authServiceSpy.login.and.returnValue(of({ token: 'abc' }));
    component.onSubmit(new Event('submit'));
    expect(authServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'ValidPassword123!');
  });

  it('should show success toast and navigate on successful login', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'ValidPassword123!';
    authServiceSpy.login.and.returnValue(of({ token: 'abc' }));
    component.onSubmit(new Event('submit'));
    tick();
    expect(toastSpy.success).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show error toast if login returns no token', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'ValidPassword123!';
    authServiceSpy.login.and.returnValue(of({}));
    component.onSubmit(new Event('submit'));
    tick();
    expect(toastSpy.error).toHaveBeenCalled();
  }));

  it('should show error toast on login error', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'ValidPassword123!';
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));
    component.onSubmit(new Event('submit'));
    tick();
    expect(toastSpy.error).toHaveBeenCalled();
  }));

  it('should set isLoading to true while submitting and false after', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'ValidPassword123!';
    const loginSubject = new Subject<any>();
    authServiceSpy.login.and.returnValue(loginSubject.asObservable());

    component.onSubmit(new Event('submit'));
    expect(component.isLoading).toBeTrue();

    loginSubject.next({ token: 'abc' });
    loginSubject.complete();
    tick();

    expect(component.isLoading).toBeFalse();
  }));

  it('should mark email and password as touched on submit', () => {
    component.emailTouched = false;
    component.passwordTouched = false;
    component.onSubmit(new Event('submit'));
    expect(component.emailTouched).toBeTrue();
    expect(component.passwordTouched).toBeTrue();
  });

  it('should store token and refreshToken in localStorage on successful login', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'ValidPassword123!';
    authServiceSpy.login.and.returnValue(of({ token: 'abc', refreshToken: 'refresh-xyz' }));

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    component.onSubmit(new Event('submit'));
    tick();

    expect(localStorage.getItem('token')).toBe('abc');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-xyz');
  }));

  it('should not store refreshToken in localStorage on login error', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'ValidPassword123!';
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    localStorage.setItem('refreshToken', 'should-be-removed');

    component.onSubmit(new Event('submit'));
    tick();

    expect(localStorage.getItem('refreshToken')).toBe('should-be-removed');
  }));

	it('should dispatch loadUserSuccess action on successful login', fakeAsync(() => {
		const store = TestBed.inject(Store);
		spyOn(store, 'dispatch');
		component.email = 'user@example.com';
		component.password = 'ValidPassword123!';
		const user = { id: '1', email: 'user@example.com', firstName: 'Test', lastName: 'User', role: 'ROLE_USER', createdAt: new Date(), updatedAt: new Date() };
		authServiceSpy.login.and.returnValue(of({ token: 'abc', user }));

		component.onSubmit(new Event('submit'));
		tick();

		expect(store.dispatch).toHaveBeenCalledWith(
			jasmine.objectContaining({
				type: '[User] Load User Success',
				user
			})
		);
	}));
});