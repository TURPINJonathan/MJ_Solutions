import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SelectComponent } from './select';

@Component({
  standalone: true,
  imports: [SelectComponent],
  template: `<app-select
    [name]="name"
    [label]="label"
    [required]="required"
    [disabled]="disabled"
    [error]="error"
    [valid]="valid"
    [options]="options"
    [placeholder]="placeholder"
  ></app-select>`
})
class TestHostComponent {
  name = 'role';
  label?: string = 'Rôle';
  required = false;
  disabled = false;
  error = false;
  valid = false;
  placeholder = 'Choisir...';
  options = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Utilisateur' }
  ];
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const select = fixture.debugElement.query(By.css('select'));
    expect(select).toBeTruthy();
  });

  it('should display the placeholder', () => {
    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(select.options[0].textContent?.trim()).toBe('Choisir...');
  });

  it('should display all options', () => {
    const options = fixture.debugElement.queryAll(By.css('option'));
    // 1 pour le placeholder + 2 pour les options
    expect(options.length).toBe(3);
    expect(options[1].nativeElement.textContent.trim()).toBe('Admin');
    expect(options[2].nativeElement.textContent.trim()).toBe('Utilisateur');
  });

  it('should be disabled when [disabled]=true', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(select.disabled).toBeTrue();
  });

  it('should have select-error class when [error]=true', () => {
    hostComponent.error = true;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(select.classList).toContain('select-error');
  });

  it('should have select-valid class when [valid]=true', () => {
    hostComponent.valid = true;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(select.classList).toContain('select-valid');
  });

  it('should display the label when [label] is set', () => {
    hostComponent.label = 'Type';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.select-label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Type');
  });

  it('should not display the label when [label] is not set', () => {
    hostComponent.label = undefined;
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.select-label'));
    expect(label).toBeNull();
  });

  it('should emit value on selection', () => {
    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    select.value = select.options[2].value; // 'user'
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(select.value).toBe('user');
  });
});