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
					field: 164,
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
});
