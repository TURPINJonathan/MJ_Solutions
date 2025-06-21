import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { runInInjectionContext, Injector } from '@angular/core';
import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    navigateSpy = jasmine.createSpy('navigate');
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate: navigateSpy } }
      ]
    });
    localStorage.clear();
    window.Cypress = undefined;
  });

  function fakeRoute(): ActivatedRouteSnapshot {
    return {} as ActivatedRouteSnapshot;
  }
  function fakeState(): RouterStateSnapshot {
    return {} as RouterStateSnapshot;
  }

  function callGuard() {
    const injector = TestBed.inject(Injector);
    return runInInjectionContext(injector, () => AuthGuard(fakeRoute(), fakeState()));
  }

  it('should allow access if Cypress is present', () => {
    window.Cypress = true;
    expect(callGuard()).toBeTrue();
    window.Cypress = undefined;
  });

  it('should deny access and redirect if no token', () => {
    expect(callGuard()).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});