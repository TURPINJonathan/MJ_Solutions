import { environment } from '#env/environment';
import { Technology } from '#SModels/technology.model';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TechnologyService } from './technology.service';

describe('TechnologyService', () => {
  let service: TechnologyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TechnologyService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TechnologyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all technologies', () => {
    const mockTechnologies: Technology[] = [
      {
        id: 1,
        name: 'Angular',
        description: 'Framework front-end',
        proficiency: 90,
        documentationUrl: 'https://angular.io',
        logo: {
          id: 201,
          fileId: 164,
          fileName: 'angular.png',
          url: 'https://example.com/angular.png',
        },
        color: '#dd0031',
        types: ['FRONTEND'],
        isFavorite: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        deletedAt: undefined
      },
      {
        id: 2,
        name: 'React',
        description: 'Librairie front-end',
        proficiency: 85,
        documentationUrl: 'https://react.dev',
        logo: null,
        color: '#61dafb',
        types: ['FRONTEND'],
        isFavorite: false,
        createdAt: new Date('2024-01-02T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
        deletedAt: undefined
      }
    ];

    service.getAllTechnologies().subscribe(res => {
      expect(res).toEqual(mockTechnologies);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/technology/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTechnologies);
  });

  it('should create a technology', () => {
    const data: Technology = {
      id: 3,
      name: 'Vue.js',
      description: 'Framework JS',
      proficiency: 80,
      documentationUrl: 'https://vuejs.org',
      logo: null,
      color: '#42b883',
      types: ['FRONTEND'],
      isFavorite: false,
      createdAt: new Date('2024-01-03T00:00:00Z'),
      updatedAt: new Date('2024-01-03T00:00:00Z'),
      deletedAt: undefined
    };

    service.createTechnology(data).subscribe(res => {
      expect(res).toEqual(data);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/technology/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush(data);
  });

  it('should update a technology', () => {
    const id = 3;
    const data: Technology = {
      id: 3,
      name: 'Vue.js',
      description: 'Framework JS modifié',
      proficiency: 85,
      documentationUrl: 'https://vuejs.org',
      logo: null,
      color: '#42b883',
      types: ['FRONTEND'],
      isFavorite: true,
      createdAt: new Date('2024-01-03T00:00:00Z'),
      updatedAt: new Date('2024-01-04T00:00:00Z'),
      deletedAt: undefined
    };

    service.updateTechnology(id, data).subscribe(res => {
      expect(res).toEqual(data);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/technology/update/${id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(data);
    req.flush(data);
  });

  it('should delete a technology', () => {
    const id = 4;
    service.deleteTechnology(id).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/technology/delete/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should propagate an HTTP error', () => {
    let error: any;
    service.getAllTechnologies().subscribe({
      error: err => error = err
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/technology/all`);
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(error.status).toBe(500);
  });
});