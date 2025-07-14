import { ToastUtils } from '#BO/utils/toastUtils';
import { FileService } from '#services/common/file.service';
import { CompagnyService } from '#services/compagny/compagny.service';
import { Compagny } from '#shared/models/compagny.model';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { CompagnyPage } from './compagny';

describe('CompagnyPage', () => {
  let component: CompagnyPage;
  let fixture: ComponentFixture<CompagnyPage>;
  let compagnyServiceSpy: jasmine.SpyObj<CompagnyService>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;
  let toastSpy: jasmine.SpyObj<ToastUtils>;

  beforeEach(async () => {
    compagnyServiceSpy = jasmine.createSpyObj('CompagnyService', [
      'getAllCompagnies',
      'createCompagny',
      'updateCompagny',
      'deleteCompagny'
    ]);
    fileServiceSpy = jasmine.createSpyObj('FileService', ['uploadLogo']);
    toastSpy = jasmine.createSpyObj('ToastUtils', ['info', 'success', 'error']);

    compagnyServiceSpy.getAllCompagnies.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        CompagnyPage,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: CompagnyService, useValue: compagnyServiceSpy },
        { provide: FileService, useValue: fileServiceSpy },
        { provide: ToastUtils, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompagnyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load companies and show success toast', fakeAsync(() => {
    const companies = [
      {
        id: '1',
        name: 'Test',
        website: '',
        color: '',
        logo: '',
        type: 'PROSPECT',
        contractStartAt: null,
        contractEndAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        pictures: [{
          id: 1,
          isLogo: true,
          url: '/img.png',
          field: 'logo',
          fileName: 'img.png',
          master: false
        }]
      }
    ];
    compagnyServiceSpy.getAllCompagnies.and.returnValue(of(companies as unknown as Compagny[]));

    component.loadCompagnies();
    tick();

    expect(component.compagnies.length).toBe(1);
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.compagnies[0].logoUrl).toContain('/img.png');
  }));

  it('should show info toast if the list is empty', fakeAsync(() => {
    compagnyServiceSpy.getAllCompagnies.and.returnValue(of([]));

    component.loadCompagnies();
    tick();

    expect(toastSpy.info).toHaveBeenCalled();
    expect(component.compagnies.length).toBe(0);
  }));

  it('should show error toast on load failure', fakeAsync(() => {
    compagnyServiceSpy.getAllCompagnies.and.returnValue(throwError(() => new Error('fail')));

    component.loadCompagnies();
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
  }));

  it('should add a contact', () => {
    const initialLength = component.compagnyContacts.length;
    component.addContact();
    expect(component.compagnyContacts.length).toBe(initialLength + 1);
  });

  it('should remove a contact', () => {
    component.compagnyContacts = [
      { lastname: 'A', firstname: 'B', position: '', email: '', phone: '', picture: null },
      { lastname: 'C', firstname: 'D', position: '', email: '', phone: '', picture: null }
    ];
    component.removeContact(0);
    expect(component.compagnyContacts.length).toBe(1);
    expect(component.compagnyContacts[0].lastname).toBe('C');
  });

  it('should open and close the create modal', () => {
    component.showDialog = false;
    component.openCreateCompagnyModal();
    expect(component.showDialog).toBeTrue();
    component.closeCreateCompagnyModal();
    expect(component.showDialog).toBeFalse();
  });

  it('should validate the validation getters', () => {
    component.compagnyName = '';
    expect(component.nameInvalid).toBeTrue();
    component.compagnyName = 'AB';
    expect(component.nameInvalid).toBeFalse();

    component.compagnyWebsite = '';
    expect(component.websiteInvalid).toBeTrue();
    component.compagnyWebsite = 'https://mj-solutions.fr';
    expect(component.websiteInvalid).toBeFalse();

    component.compagnyColor = '';
    expect(component.colorInvalid).toBeTrue();
    component.compagnyColor = '#fff';
    expect(component.colorInvalid).toBeFalse();

    component.compagnyDescription = '';
    expect(component.descriptionInvalid).toBeTrue();
    component.compagnyDescription = '12345';
    expect(component.descriptionInvalid).toBeFalse();

    component.compagnyType = '' as 'CDI' | 'FREELANCE' | 'PROSPECT';
    expect(component.typeInvalid).toBeTrue();
    component.compagnyType = 'CDI';
    expect(component.typeInvalid).toBeFalse();

    component.compagnyType = 'CDI';
    component.compagnyContractStartAt = null;
    expect(component.getContractStartAtInvalid()).toBeTrue();
    component.compagnyContractStartAt = new Date();
    expect(component.getContractStartAtInvalid()).toBeFalse();

    component.compagnyContractEndAt = null;
    expect(component.getContractEndAtInvalid()).toBeTrue();
    component.compagnyContractEndAt = new Date();
    expect(component.getContractEndAtInvalid()).toBeFalse();
  });

  it('should disable the form if a field is invalid', () => {
    component.compagnyName = '';
    component.compagnyWebsite = '';
    component.compagnyColor = '';
    component.compagnyDescription = '';
    component.compagnyType = undefined as any;
    expect(component.formInvalid).toBeTrue();

    component.compagnyName = 'AB';
    component.compagnyWebsite = 'https://mj-solutions.fr';
    component.compagnyColor = '#fff';
    component.compagnyDescription = '12345';
    component.compagnyType = 'CDI';
    expect(component.formInvalid).toBeFalse();
  });

  it('should call fileService.uploadLogo and compagnyService.createCompagny when creating', fakeAsync(async () => {
    component.compagnyName = 'Test';
    component.compagnyDescription = 'Long description';
    component.compagnyColor = '#fff';
    component.compagnyWebsite = 'https://mj-solutions.fr';
    component.compagnyLogo = new File([''], 'logo.png', { type: 'image/png' });
    component.compagnyContacts = [];
    component.compagnyType = 'CDI';
    component.compagnyContractStartAt = new Date('2025-01-01');
    component.compagnyContractEndAt = new Date('2025-12-31');

    fileServiceSpy.uploadLogo.and.returnValue(of({ success: true, data: { id: 123 } }));
    compagnyServiceSpy.createCompagny.and.returnValue(of({}));

    await component.onSubmitCompagny({});
    tick();

    expect(fileServiceSpy.uploadLogo).toHaveBeenCalled();
    expect(compagnyServiceSpy.createCompagny).toHaveBeenCalled();
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.showDialog).toBeFalse();
  }));

  it('should handle error when creating a company', fakeAsync(async () => {
    component.compagnyName = 'Test';
    component.compagnyDescription = 'Long description';
    component.compagnyColor = '#fff';
    component.compagnyWebsite = 'https://mj-solutions.fr';
    component.compagnyLogo = null;
    component.compagnyContacts = [];
    component.compagnyType = 'FREELANCE';
    component.compagnyContractStartAt = new Date('2025-01-01');
    component.compagnyContractEndAt = new Date('2025-12-31');

    compagnyServiceSpy.createCompagny.and.returnValue(throwError(() => new Error('fail')));

    await component.onSubmitCompagny({});
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should call compagnyService.updateCompagny when updating', fakeAsync(async () => {
    const compagny = {
      id: 42,
      name: 'Company Update',
      website: 'https://update.fr',
      color: '#123456',
      logo: '',
      type: 'CDI',
      contractStartAt: new Date('2025-01-01'),
      contractEndAt: new Date('2025-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
      pictures: [],
      contacts: []
    } as any;

    component.openUpdateCompagnyModal(compagny);
    component.compagnyName = 'Company Update Modified';
    compagnyServiceSpy.updateCompagny.and.returnValue(of({}));

    await component.onSubmitCompagny({});
    tick();

    expect(compagnyServiceSpy.updateCompagny).toHaveBeenCalledWith(42, jasmine.objectContaining({
      name: 'Company Update Modified'
    }));
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.showDialog).toBeFalse();
  }));

  it('should handle error when updating a company', fakeAsync(async () => {
    const compagny = {
      id: 43,
      name: 'Company Update',
      website: 'https://update.fr',
      color: '#123456',
      logo: '',
      type: 'CDI',
      contractStartAt: new Date('2025-01-01'),
      contractEndAt: new Date('2025-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
      pictures: [],
      contacts: []
    } as any;

    component.openUpdateCompagnyModal(compagny);
    compagnyServiceSpy.updateCompagny.and.returnValue(throwError(() => new Error('fail')));

    await component.onSubmitCompagny({});
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should call compagnyService.deleteCompagny when deleting', fakeAsync(() => {
    const compagny = {
      id: 99,
      name: 'Company Delete'
    } as any;

    compagnyServiceSpy.deleteCompagny.and.returnValue(of({}));

    component.onDeleteCompagny(compagny);
    tick();

    expect(compagnyServiceSpy.deleteCompagny).toHaveBeenCalledWith(99);
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error when deleting', fakeAsync(() => {
    const compagny = {
      id: 100,
      name: 'Company Delete'
    } as any;

    compagnyServiceSpy.deleteCompagny.and.returnValue(throwError(() => new Error('fail')));

    component.onDeleteCompagny(compagny);
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));
});