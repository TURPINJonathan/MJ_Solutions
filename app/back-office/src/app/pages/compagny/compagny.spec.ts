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
    compagnyServiceSpy = jasmine.createSpyObj('CompagnyService', ['getAllCompagnies', 'createCompagny']);
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

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les colonnes dans ngOnInit', () => {
    component.ngOnInit();
    expect(component.columns.length).toBeGreaterThan(0);
    expect(component.columns[0].key).toBe('name');
  });

  it('devrait charger les compagnies et afficher un toast de succès', fakeAsync(() => {
    const compagnies = [
      {
        id: '1',
        name: 'Test',
        website: '',
        color: '',
        logo: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        pictures: [{
          id: 1,
          logo: true,
          url: '/img.png',
          field: 'logo',
          fileName: 'img.png',
          master: false
        }]
      }
    ];
    compagnyServiceSpy.getAllCompagnies.and.returnValue(of(compagnies as unknown as Compagny[]));

    component.loadCompagnies();
    tick();

    expect(component.compagnies.length).toBe(1);
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.compagnies[0].logoUrl).toContain('/img.png');
  }));

  it('devrait afficher un toast info si la liste est vide', fakeAsync(() => {
    compagnyServiceSpy.getAllCompagnies.and.returnValue(of([]));

    component.loadCompagnies();
    tick();

    expect(toastSpy.info).toHaveBeenCalled();
    expect(component.compagnies.length).toBe(0);
  }));

  it('devrait afficher un toast d\'erreur en cas d\'échec', fakeAsync(() => {
    compagnyServiceSpy.getAllCompagnies.and.returnValue(throwError(() => new Error('fail')));

    component.loadCompagnies();
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
  }));

  it('devrait ajouter un contact', () => {
    const initialLength = component.compagnyContacts.length;
    component.addContact();
    expect(component.compagnyContacts.length).toBe(initialLength + 1);
  });

  it('devrait supprimer un contact', () => {
    component.compagnyContacts = [
      { lastname: 'A', firstname: 'B', position: '', email: '', phone: '', picture: null },
      { lastname: 'C', firstname: 'D', position: '', email: '', phone: '', picture: null }
    ];
    component.removeContact(0);
    expect(component.compagnyContacts.length).toBe(1);
    expect(component.compagnyContacts[0].lastname).toBe('C');
  });

  it('devrait ouvrir et fermer la modal de création', () => {
    component.showDialog = false;
    component.openCreateCompagnyModal();
    expect(component.showDialog).toBeTrue();
    component.closeCreateCompagnyModal();
    expect(component.showDialog).toBeFalse();
  });

  it('devrait valider les getters de validation', () => {
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
  });

  it('devrait désactiver le formulaire si un champ est invalide', () => {
    component.compagnyName = '';
    component.compagnyWebsite = '';
    component.compagnyColor = '';
    component.compagnyDescription = '';
    expect(component.formInvalid).toBeTrue();

    component.compagnyName = 'AB';
    component.compagnyWebsite = 'https://mj-solutions.fr';
    component.compagnyColor = '#fff';
    component.compagnyDescription = '12345';
    expect(component.formInvalid).toBeFalse();
  });

  it('devrait appeler fileService.uploadLogo et compagnyService.createCompagny lors de la création', fakeAsync(async () => {
    component.compagnyName = 'Test';
    component.compagnyDescription = 'Description longue';
    component.compagnyColor = '#fff';
    component.compagnyWebsite = 'https://mj-solutions.fr';
    component.compagnyLogo = new File([''], 'logo.png', { type: 'image/png' });
    component.compagnyContacts = [];

    fileServiceSpy.uploadLogo.and.returnValue(of({ success: true, data: { id: 123 } }));
    compagnyServiceSpy.createCompagny.and.returnValue(of({}));

    await component.onCreateCompagny({});
    tick();

    expect(fileServiceSpy.uploadLogo).toHaveBeenCalled();
    expect(compagnyServiceSpy.createCompagny).toHaveBeenCalled();
    expect(toastSpy.success).toHaveBeenCalled();
    expect(component.showDialog).toBeFalse();
  }));

  it('devrait gérer une erreur lors de la création de la compagnie', fakeAsync(async () => {
    component.compagnyName = 'Test';
    component.compagnyDescription = 'Description longue';
    component.compagnyColor = '#fff';
    component.compagnyWebsite = 'https://mj-solutions.fr';
    component.compagnyLogo = null;
    component.compagnyContacts = [];

    compagnyServiceSpy.createCompagny.and.returnValue(throwError(() => new Error('fail')));

    await component.onCreateCompagny({});
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));
});