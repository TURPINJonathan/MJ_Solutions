
import { jwtDecode, JwtPayload } from 'jwt-decode';

export function isValidEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=[{}\];':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
}

export function isTokenExpired(token: string): boolean {
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		if (!decoded.exp) return true;
		
		return Date.now() >= decoded.exp * 1000;
	} catch {
		return true;
	}
}

export function isValidWebsite(url: string): boolean {
  return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(url);
}