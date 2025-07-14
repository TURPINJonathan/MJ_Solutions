import { ToastUtils } from '#BO/utils/toastUtils';
import { FileService } from '#services/common/file.service';
import { TechnologyService } from '#services/technology/technology.service';
import { Technology } from '#SModels/technology.model';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { TechnologyPage } from './technology';

describe('TechnologyPage', () => {
  let component: TechnologyPage;
  let fixture: ComponentFixture<TechnologyPage>;
  let technologyServiceSpy: jasmine.SpyObj<TechnologyService>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;
  let toastSpy: jasmine.SpyObj<ToastUtils>;

  beforeEach(async () => {
    technologyServiceSpy = jasmine.createSpyObj('TechnologyService', [
      'getAllTechnologies',
      'createTechnology',
      'updateTechnology',
      'deleteTechnology'
    ]);
    fileServiceSpy = jasmine.createSpyObj('FileService', ['uploadLogo']);
    toastSpy = jasmine.createSpyObj('ToastUtils', ['info', 'success', 'error']);

    technologyServiceSpy.getAllTechnologies.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        TechnologyPage,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: TechnologyService, useValue: technologyServiceSpy },
        { provide: FileService, useValue: fileServiceSpy },
        { provide: ToastUtils, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load technologies and show success toast', fakeAsync(() => {
    const technologies: Technology[] = [
      {
        id: 1,
        name: 'React',
        description: 'JS library',
        proficiency: 5,
        documentationUrl: 'https://react.dev',
        color: '#61dafb',
        types: ['FRONTEND'],
        isFavorite: true,
        logo: { id: 1, fileId: 1, fileName: 'react.png', url: '/img/react.png' }
      }
    ];
    technologyServiceSpy.getAllTechnologies.and.returnValue(of(technologies));

    component.loadItems();
    tick();

    expect(component.items.length).toBe(1);
    expect(toastSpy.success).toHaveBeenCalled();
  }));

  it('should show info toast if list is empty', fakeAsync(() => {
    technologyServiceSpy.getAllTechnologies.and.returnValue(of([]));

    component.loadItems();
    tick();

    expect(toastSpy.info).toHaveBeenCalled();
    expect(component.items.length).toBe(0);
  }));

  it('should show error toast on load failure', fakeAsync(() => {
    technologyServiceSpy.getAllTechnologies.and.returnValue(throwError(() => new Error('fail')));

    component.loadItems();
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
  }));

  it('should select a logo', () => {
    const file = new File([''], 'logo.png', { type: 'image/png' });
    component.onLogoSelected(file);
    expect(component.technologyLogo).toBe(file);
    expect(component.technologyLogoPreviewUrl).toBeNull();
  });

  it('should add and remove a type', () => {
    component.technologyTypes = [];
    component.onToggleType('FRONTEND', true);
    expect(component.technologyTypes).toContain('FRONTEND');
    component.onToggleType('FRONTEND', false);
    expect(component.technologyTypes).not.toContain('FRONTEND');
  });

  it('should format types', () => {
    spyOn(component, 'formatStringLabel').and.callFake((str: string) => str.toLowerCase());
    const result = component.formatTypes(['FRONTEND', 'BACKEND']);
    expect(result).toBe('frontend, backend');
  });

  it('should return null if formatTypes receives undefined or empty', () => {
    expect(component.formatTypes(undefined)).toBeNull();
    expect(component.formatTypes([])).toBeNull();
  });

  it('should call createItem when submitting in create mode', fakeAsync(() => {
    spyOn(component, 'createItem').and.returnValue(Promise.resolve());
    component.modalMode = 'create';
    component.onSubmitForm({});
    expect(component.createItem).toHaveBeenCalled();
  }));

  it('should call updateItem when submitting in update mode', fakeAsync(() => {
    spyOn(component, 'updateItem').and.returnValue(Promise.resolve());
    component.modalMode = 'update';
    component.selectedItem = { id: 42 } as Technology;
    component.onSubmitForm({});
    expect(component.updateItem).toHaveBeenCalledWith(42);
  }));

  it('should create a technology with logo', fakeAsync(async () => {
    component.technologyName = 'React';
    component.technologyDescription = 'JS library';
    component.technologyProficiency = 5;
    component.technologyDocumentationUrl = 'https://react.dev';
    component.technologyColor = '#61dafb';
    component.technologyTypes = ['FRONTEND'];
    component.technologyIsFavorite = true;
    component.technologyLogo = new File([''], 'logo.png', { type: 'image/png' });

    fileServiceSpy.uploadLogo.and.returnValue(of({ success: true, data: { id: 123 } }));
    technologyServiceSpy.createTechnology.and.returnValue(of({
      id: 2,
      name: 'React',
      description: 'JS library',
      proficiency: 5,
      documentationUrl: 'https://react.dev',
      color: '#61dafb',
      types: ['FRONTEND'],
      isFavorite: true,
      logo: { id: 123, fileId: 123, fileName: 'logo.png', url: '' }
    } as Technology));

    await component.createItem({});
    tick();

    expect(fileServiceSpy.uploadLogo).toHaveBeenCalled();
    expect(technologyServiceSpy.createTechnology).toHaveBeenCalled();
    expect(toastSpy.success).toHaveBeenCalled();
  }));

  it('should handle error when creating', fakeAsync(async () => {
    component.technologyName = 'React';
    component.technologyLogo = null;
    technologyServiceSpy.createTechnology.and.returnValue(throwError(() => new Error('fail')));

    await component.createItem({});
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should update a technology', fakeAsync(async () => {
    component.selectedItem = { id: 42 } as Technology;
    component.technologyName = 'React';
    technologyServiceSpy.updateTechnology.and.returnValue(of({
      id: 42,
      name: 'React',
      description: '',
      proficiency: 0,
      documentationUrl: '',
      color: '',
      types: [],
      isFavorite: false,
      logo: null
    } as Technology));

    await component.updateItem(42);
    tick();

    expect(technologyServiceSpy.updateTechnology).toHaveBeenCalledWith(42, jasmine.objectContaining({
      name: 'React'
    }));
    expect(toastSpy.success).toHaveBeenCalled();
  }));

  it('should handle error when updating', fakeAsync(async () => {
    component.selectedItem = { id: 43 } as Technology;
    technologyServiceSpy.updateTechnology.and.returnValue(throwError(() => new Error('fail')));

    await component.updateItem(43);
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should delete a technology', fakeAsync(() => {
    technologyServiceSpy.deleteTechnology.and.returnValue(of({ success: true }));

    component.deleteItem(99);
    tick();

    expect(technologyServiceSpy.deleteTechnology).toHaveBeenCalledWith(99);
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error when deleting', fakeAsync(() => {
    technologyServiceSpy.deleteTechnology.and.returnValue(throwError(() => new Error('fail')));

    component.deleteItem(100);
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should reset the form', () => {
    component.technologyName = 'Test';
    component.technologyDescription = 'Desc';
    component.technologyProficiency = 2;
    component.technologyDocumentationUrl = 'url';
    component.technologyLogo = new File([''], 'logo.png');
    component.technologyLogoPreviewUrl = 'url';
    component.technologyColor = '#fff';
    component.technologyTypes = ['FRONTEND'];
    component.technologyIsFavorite = true;
    component.selectedItem = { id: 1 } as Technology;

    component.resetFormPublic();

    expect(component.technologyName).toBe('');
    expect(component.technologyDescription).toBe('');
    expect(component.technologyProficiency).toBe(0);
    expect(component.technologyDocumentationUrl).toBe('');
    expect(component.technologyLogo).toBeNull();
    expect(component.technologyLogoPreviewUrl).toBeNull();
    expect(component.technologyColor).toBe('#000000');
    expect(component.technologyTypes).toEqual([]);
    expect(component.technologyIsFavorite).toBeFalse();
    expect(component.selectedItem).toBeNull();
  });

  it('should open the update modal and fill fields', () => {
    const tech: Technology = {
      id: 1,
      name: 'React',
      description: 'JS library',
      proficiency: 5,
      documentationUrl: 'https://react.dev',
      color: '#61dafb',
      types: ['FRONTEND'],
      isFavorite: true,
      logo: { id: 1, fileId: 1, fileName: 'react.png', url: '/img/react.png' }
    };
    component.openUpdateTechnologyModal(tech);

    expect(component.technologyName).toBe('React');
    expect(component.technologyDescription).toBe('JS library');
    expect(component.technologyProficiency).toBe(5);
    expect(component.technologyDocumentationUrl).toBe('https://react.dev');
    expect(component.technologyLogo).toBeNull();
    expect(component.technologyLogoPreviewUrl).toBe('/img/react.png');
    expect(component.technologyColor).toBe('#61dafb');
    expect(component.technologyTypes).toEqual(['FRONTEND']);
    expect(component.technologyIsFavorite).toBeTrue();
  });

  it('should open the view modal', () => {
    const tech: Technology = { id: 1, name: 'React' } as Technology;
    spyOn(component, 'openShowModal');
    component.onRowClick(tech);
    expect(component.openShowModal).toHaveBeenCalledWith(tech);
  });

  it('should call deleteItem if id is present', () => {
    spyOn(component, 'deleteItem');
    const tech: Technology = { id: 1 } as Technology;
    component.deleteTechnology(tech);
    expect(component.deleteItem).toHaveBeenCalledWith(1);
  });
});