import { environment } from '#env/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call uploadLogo and POST to the correct URL', () => {
    const formData = new FormData();
    const mockResponse = { success: true, url: 'http://test/logo.png' };

    service.uploadLogo(formData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/files/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(formData);
    req.flush(mockResponse);
  });
});