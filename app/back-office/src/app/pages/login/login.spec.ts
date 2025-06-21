import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginPage } from './login';
import { AuthService } from '#services/auth/auth.service';
import { ToastUtils } from '#utils/toastUtils';
import { InputComponent } from '#common/ui/input/input';
import { ButtonComponent } from '#common/ui/button/button';

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
      imports: [FormsModule, InputComponent, ButtonComponent],
      declarations: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastUtils, useValue: toastSpy },
        { provide: Router, useValue: routerSpy }
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
    expect(compiled.querySelector('h1')?.textContent).toContain('Connexion');
    expect(compiled.querySelector('app-input[type="email"]')).toBeTruthy();
    expect(compiled.querySelector('app-input[type="password"]')).toBeTruthy();
    expect(compiled.querySelector('app-button[type="submit"]')).toBeTruthy();
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
    authServiceSpy.login.and.returnValue(of({ token: 'abc' }));
    component.onSubmit(new Event('submit'));
    expect(component.isLoading).toBeTrue();
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
});