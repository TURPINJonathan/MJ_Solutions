import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header text', () => {
    const p = fixture.debugElement.query(By.css('p'));
    expect(p.nativeElement.textContent).toContain('header works!');
  });

  it('should toggle dark mode and update localStorage', () => {
    spyOn(localStorage, 'setItem');
    document.body.classList.remove('dark');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.theme-switch'));
    button.nativeElement.click();
    expect(document.body.classList.contains('dark')).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

    button.nativeElement.click();
    expect(document.body.classList.contains('dark')).toBeFalse();
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should show correct label depending on theme', () => {
    document.body.classList.remove('dark');
    fixture.detectChanges();
    let button = fixture.debugElement.query(By.css('.theme-switch'));
    expect(button.nativeElement.textContent).toContain('🌙 Dark');

    document.body.classList.add('dark');
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('.theme-switch'));
    expect(button.nativeElement.textContent).toContain('☀️ Light');
  });

  it('should enable dark mode on init if saved in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('dark');
    document.body.classList.remove('dark');
    component.ngOnInit();
    expect(document.body.classList.contains('dark')).toBeTrue();
  });
});