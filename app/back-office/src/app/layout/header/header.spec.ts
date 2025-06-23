import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Header } from './header';
import { TranslateModule } from '@ngx-translate/core';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
				Header,
				TranslateModule.forRoot()
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
    component.closeMenu();
    expect(component.menuOpen).toBeFalse();
  });

  it('should display the logo image', () => {
    const logo = fixture.debugElement.query(By.css('.logo img'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.getAttribute('src')).toBe(component.MJSLogo);
  });

  it('should render navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('.menu-items a'));
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].nativeElement.textContent).toBeTruthy();
  });

  it('should close menu when a navigation link is clicked', () => {
    component.menuOpen = true;
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('.menu-items a'));
    link.triggerEventHandler('click', null);
    expect(component.menuOpen).toBeFalse();
  });

  it('should add class "open" to menu-items when menuOpen is true', () => {
    component.menuOpen = true;
    fixture.detectChanges();
    const menu = fixture.debugElement.query(By.css('.menu-items'));
    expect(menu.nativeElement.classList).toContain('open');
  });

  it('should add class "open" to hamburger-lines when menuOpen is true', () => {
    component.menuOpen = true;
    fixture.detectChanges();
    const burger = fixture.debugElement.query(By.css('.hamburger-lines'));
    expect(burger.nativeElement.classList).toContain('open');
  });
});