import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './language-switcher';

class MockTranslateService {
  currentLang = 'fr';
  defaultLang = 'fr';
  use = jasmine.createSpy('use');
}

describe('LanguageSwitcherComponent', () => {
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let component: LanguageSwitcherComponent;
  let translate: MockTranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button for each language', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(component.languages.length);
  });

  it('should call setLang and translate.use on button click', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[1].nativeElement.click();
    expect(translate.use).toHaveBeenCalledWith('en');
  });

  it('should apply .active class to the current language', () => {
    translate.currentLang = 'fr';
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].nativeElement.classList).toContain('active');
    expect(buttons[1].nativeElement.classList).toContain('inactive');
  });

  it('should set aria-label with language label', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].attributes['aria-label']).toBe('Français');
    expect(buttons[1].attributes['aria-label']).toBe('English');
  });

  it('should display the flag for each language', () => {
    const flags = fixture.debugElement.queryAll(By.css('.flag'));
    expect(flags[0].nativeElement.textContent).toContain('🇫🇷');
    expect(flags[1].nativeElement.textContent).toContain('🇬🇧');
  });
});