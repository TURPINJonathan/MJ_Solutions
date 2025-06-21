import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormComponent } from './form';

@Component({
  standalone: true,
  imports: [FormComponent],
  template: `
    <app-form [loading]="loading" [error]="error" [ngClass]="ngClass" (formSubmit)="onSubmit($event)">
      <span class="slot-content">Contenu projeté</span>
    </app-form>
  `
})
class TestHostComponent {
  loading = false;
  error: string | null = null;
  ngClass = 'custom-class';
  submitted = false;
  onSubmit() {
    this.submitted = true;
  }
}

describe('FormComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent] // TestHostComponent est standalone
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(host).toBeTruthy();
  });

  it('should render projected content', () => {
    const content = fixture.debugElement.query(By.css('.slot-content'));
    expect(content).toBeTruthy();
    expect(content.nativeElement.textContent).toContain('Contenu projeté');
  });

  it('should emit formSubmit on submit', () => {
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', new Event('submit'));
    expect(host.submitted).toBeTrue();
  });

  it('should not emit formSubmit when loading', () => {
    host.loading = true;
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    host.submitted = false;
    form.triggerEventHandler('submit', new Event('submit'));
    expect(host.submitted).toBeFalse();
  });

  it('should display error message when error is set', () => {
    host.error = 'Erreur test';
    fixture.detectChanges();
    const errorDiv = fixture.debugElement.query(By.css('.form-error'));
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.nativeElement.textContent).toContain('Erreur test');
  });

  it('should display loader when loading is true', () => {
    host.loading = true;
    fixture.detectChanges();
    const loaderDiv = fixture.debugElement.query(By.css('.form-loader'));
    expect(loaderDiv).toBeTruthy();
    expect(loaderDiv.nativeElement.textContent).toContain('Loading');
  });

  it('should apply custom class to form', () => {
    const form = fixture.debugElement.query(By.css('form'));
    expect(form.nativeElement.classList).toContain('custom-class');
  });
});