import { isTokenExpired } from '#shared/utils/validation.utils';
import { CanActivateChildFn } from '@angular/router';

export const AuthGuard: CanActivateChildFn = (childRoute, state) => {
  const token = localStorage.getItem('token');
	if (!token || isTokenExpired(token)) {
		localStorage.removeItem('token');
		window.location.href = '/akwaytenpo/login';
		return false;
	}

	return true;
};