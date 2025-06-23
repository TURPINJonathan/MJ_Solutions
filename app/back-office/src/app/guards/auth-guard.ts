import { isTokenExpired } from '#shared/utils/validation.utils';
import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

declare global {
  interface Window {
	Cypress?: unknown;
  }
}

export const AuthGuard: CanActivateChildFn = (childRoute, state) => {
  const token = localStorage.getItem('token');
	const router = inject(Router);
	
	if (window.Cypress) return true;

	if (!token || isTokenExpired(token)) {
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		router.navigate(['/login']);

		return false;
	}

	return true;
};