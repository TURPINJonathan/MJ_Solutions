import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Header,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menuOpen when toggleMenu is called', () => {
    expect(component.menuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.menuOpen).toBeFalse();
  });

  it('should close menu when closeMenu is called', () => {
    component.menuOpen = true;
    component.activeSubMenu = 'SETTINGS.TITLE';
    component.closeMenu();
    expect(component.menuOpen).toBeFalse();
    expect(component.activeSubMenu).toBeNull();
  });

  it('should display the logo image', () => {
    const logo = fixture.debugElement.query(By.css('.logo img'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.getAttribute('src')).toBe(component.MJSLogo);
  });

  it('should close submenu when back button is clicked', () => {
    component.menuOpen = true;
    component.activeSubMenu = 'SETTINGS.TITLE';
    fixture.detectChanges();
    // Simule un bouton retour dans le sous-menu
    component.closeSubMenu({ preventDefault: () => {} } as Event);
    expect(component.activeSubMenu).toBeNull();
  });

  it('should close menu when submenu link is clicked', () => {
    component.menuOpen = true;
    component.activeSubMenu = 'SETTINGS.TITLE';
    fixture.detectChanges();
    const submenuLink = fixture.debugElement.query(By.css('.menu-items.submenu a[routerLink]'));
    if (submenuLink) {
      submenuLink.triggerEventHandler('click', null);
      expect(component.menuOpen).toBeFalse();
      expect(component.activeSubMenu).toBeNull();
    }
  });

  it('should add class "open" to menu-items when menuOpen is true', () => {
    component.menuOpen = true;
    component.activeSubMenu = null;
    fixture.detectChanges();
    const menu = fixture.debugElement.query(By.css('.menu-items:not(.submenu)'));
    expect(menu).not.toBeNull();
    if (menu) {
      expect(menu.nativeElement.classList).toContain('open');
    }
  });

  it('should add class "open" to hamburger-lines when menuOpen is true', () => {
    component.menuOpen = true;
    fixture.detectChanges();
    const burger = fixture.debugElement.query(By.css('.hamburger-lines'));
    expect(burger.nativeElement.classList).toContain('open');
  });

  it('should not render main menu when submenu is active', () => {
    component.menuOpen = true;
    component.activeSubMenu = 'SETTINGS.TITLE';
    fixture.detectChanges();
    const mainMenu = fixture.debugElement.query(By.css('.menu-items:not(.submenu)'));
    expect(mainMenu).toBeNull();
  });
});