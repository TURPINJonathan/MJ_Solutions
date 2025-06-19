import { environment } from '#env/environment';
import { AuthService } from '#services/auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
				AuthService,
				provideHttpClient(),
				provideHttpClientTesting()
			]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST to /auth/login with email and password', () => {
    const mockCredentials = { email: 'test@mail.com', password: 'REDACTED' };
    service.login(mockCredentials.email, mockCredentials.password).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
  });

  it('should propagate an HTTP error', () => {
    const mockCredentials = { email: 'test@mail.com', password: 'REDACTED' };
    const mockError = { status: 401, statusText: 'Unauthorized' };

    let error: any;
    service.login(mockCredentials.email, mockCredentials.password).subscribe({
      error: err => error = err
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({}, mockError);

    expect(error.status).toBe(401);
  });

  it('should throw error for invalid email', (done) => {
    service.login('invalid-email', '123456a!').subscribe({
      error: err => {
        expect(err.message).toBe('Invalid email format');
        done();
      }
    });
  });

  it('should throw error for invalid password', (done) => {
    service.login('test@mail.com', 'short').subscribe({
      error: err => {
        expect(err.message).toBe('Invalid password format');
        done();
      }
    });
  });
});