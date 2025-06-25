import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TableComponent } from './table';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant'], { currentLang: 'fr', defaultLang: 'fr' });
    translateSpy.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [
        { provide: TranslateService, useValue: translateSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render columns and data', () => {
    component.columns = [
      { key: 'name', label: 'Nom' },
      { key: 'website', label: 'Site' }
    ];
    component.data = [
      { id: 1, name: 'Test', website: 'https://test.fr' }
    ];
    fixture.detectChanges();
    const ths = fixture.nativeElement.querySelectorAll('th');
    expect(ths.length).toBe(2);
    expect(ths[0].textContent).toContain('Nom');
    expect(ths[1].textContent).toContain('Site');
    const tds = fixture.nativeElement.querySelectorAll('td');
    expect(tds[0].textContent).toContain('Test');
    expect(tds[1].textContent).toContain('https://test.fr');
  });

  it('should emit rowClick when a row is clicked', () => {
    spyOn(component.rowClick, 'emit');
    component.columns = [{ key: 'name', label: 'Nom' }];
    component.data = [{ id: 1, name: 'Test' }];
    fixture.detectChanges();
    const row = fixture.nativeElement.querySelector('tbody tr');
    row.click();
    expect(component.rowClick.emit).toHaveBeenCalledWith(component.data[0]);
  });

  it('should emit deleteClick when delete button is clicked', () => {
    spyOn(component.deleteClick, 'emit');
    component.columns = [{ key: 'name', label: 'Nom' }];
    component.data = [{ id: 1, name: 'Test' }];
    component.showActions = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.actions button[aria-label="Supprimer"]');
    btn.click();
    expect(component.deleteClick.emit).toHaveBeenCalledWith(component.data[0]);
  });

  it('should emit updateClick when update button is clicked', () => {
    spyOn(component.updateClick, 'emit');
    component.columns = [{ key: 'name', label: 'Nom' }];
    component.data = [{ id: 1, name: 'Test' }];
    component.showActions = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.actions button[aria-label="Modifier"]');
    btn.click();
    expect(component.updateClick.emit).toHaveBeenCalledWith(component.data[0]);
  });

  it('should format date string in formatCell', () => {
    const dateStr = '2024-06-25T12:34:56.000Z';
    spyOn(component as any, 'formatCell').and.callThrough();
    component.columns = [{ key: 'createdAt', label: 'Date' }];
    component.data = [{ id: 1, createdAt: dateStr }];
    fixture.detectChanges();
    expect((component as any).formatCell).toHaveBeenCalledWith(dateStr);
  });

  it('should display color dot for color column', () => {
    component.columns = [{ key: 'color', label: 'Couleur' }];
    component.data = [{ id: 1, color: '#ff0000' }];
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector('.color-dot');
    expect(dot).toBeTruthy();
    expect(['rgb(255, 0, 0)', '#ff0000']).toContain(dot.style.background);
  });

  it('should display logo image if logoUrl is present', () => {
    component.columns = [{ key: 'logo', label: 'Logo' }];
    component.data = [{ id: 1, logoUrl: '/logo.png' }];
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.logo-img');
    expect(img).toBeTruthy();
    expect(img.src).toContain('/logo.png');
  });

  it('should display website as link', () => {
    component.columns = [{ key: 'website', label: 'Site' }];
    component.data = [{ id: 1, website: 'https://test.fr' }];
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    expect(link).toBeTruthy();
    expect(link.href).toBe('https://test.fr/');
  });
});