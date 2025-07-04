import { environment } from '#env/environment';
import { Compagny } from '#shared/models/compagny.model';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CompagnyService } from './compagny.service';

describe('CompagnyService', () => {
  let service: CompagnyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompagnyService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CompagnyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all compagnies', () => {
    const mockCompagnies: Compagny[] = [{
      id: 1,
      name: 'Test',
			type: 'PROSPECT',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    }];
    service.getAllCompagnies().subscribe(res => {
      expect(res).toEqual(mockCompagnies);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/compagny/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCompagnies);
  });

  it('should create a compagny', () => {
    const data = { name: 'Nouvelle Compagnie' };
    const mockResponse: Compagny = {
      id: 2,
      name: 'Nouvelle Compagnie',
			type: 'CDI',
			contractStartAt: new Date('2024-01-01T00:00:00Z'),
			contractEndAt: new Date('2025-01-01T00:00:00Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    };

    service.createCompagny(data).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/compagny/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush(mockResponse);
  });

  it('should propagate an HTTP error', () => {
    let error: any;
    service.getAllCompagnies().subscribe({
      error: err => error = err
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/compagny/all`);
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(error.status).toBe(500);
  });
});