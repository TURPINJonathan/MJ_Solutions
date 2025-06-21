import { environment } from '#env/environment';
import { isValidEmail, isValidPassword } from '#SUtils/validation.utils';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    if (!isValidEmail(email)) {
      return throwError(() => new Error('Invalid email format'));
    }
    if (!isValidPassword(password)) {
      return throwError(() => new Error('Invalid password format'));
    }
    const url = `${environment.apiUrl}/auth/login`;
    return this.http.post(url, { email, password });
  }
}