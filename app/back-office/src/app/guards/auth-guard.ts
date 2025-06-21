import { isTokenExpired } from '#shared/utils/validation.utils';
import { CanActivateChildFn } from '@angular/router';

declare global {
  interface Window {
	Cypress?: any;
  }
}

export const AuthGuard: CanActivateChildFn = (childRoute, state) => {
  const token = localStorage.getItem('token');
	if (window.Cypress) {
    return true;
  }

	if (!token || isTokenExpired(token)) {
		localStorage.removeItem('token');
		window.location.href = '/akwaytenpo/login';
		return false;
	}

	return true;
};