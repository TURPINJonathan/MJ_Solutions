import { ToastUtils } from '#BO/utils/toastUtils';
import { CompagnyService } from '#services/compagny/compagny.service';
import { Compagny } from '#shared/models/compagny.model';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { CompagnyPage } from './compagny';

describe('CompagnyPage', () => {
  let component: CompagnyPage;
  let fixture: ComponentFixture<CompagnyPage>;
  let compagnyServiceSpy: jasmine.SpyObj<CompagnyService>;
  let toastSpy: jasmine.SpyObj<ToastUtils>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

	beforeEach(async () => {
		compagnyServiceSpy = jasmine.createSpyObj('CompagnyService', ['getAllCompagnies']);
		toastSpy = jasmine.createSpyObj('ToastUtils', ['info', 'success', 'error']);
		translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

		compagnyServiceSpy.getAllCompagnies.and.returnValue(of([]));

		await TestBed.configureTestingModule({
			imports: [
				CompagnyPage,
				TranslateModule.forRoot()
			],
			providers: [
				{ provide: CompagnyService, useValue: compagnyServiceSpy },
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
  translateSpy.instant.and.callFake((key: string) => key);

  component.loadCompagnies();
  tick();

  expect(component.compagnies.length).toBe(1);
  expect(toastSpy.success).toHaveBeenCalled();
  expect(component.compagnies[0].logoUrl).toContain('/img.png');
}));

  it('devrait afficher un toast info si la liste est vide', fakeAsync(() => {
    compagnyServiceSpy.getAllCompagnies.and.returnValue(of([]));
    translateSpy.instant.and.callFake((key: string) => key);

    component.loadCompagnies();
    tick();

    expect(toastSpy.info).toHaveBeenCalled();
    expect(component.compagnies.length).toBe(0);
  }));

  it('devrait afficher un toast d\'erreur en cas d\'échec', fakeAsync(() => {
    compagnyServiceSpy.getAllCompagnies.and.returnValue(throwError(() => new Error('fail')));
    translateSpy.instant.and.callFake((key: string) => key);

    component.loadCompagnies();
    tick();

    expect(toastSpy.error).toHaveBeenCalled();
  }));
});