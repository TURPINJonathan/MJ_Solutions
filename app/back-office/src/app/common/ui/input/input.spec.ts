import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { InputComponent } from '#common/ui/input/input';

@Component({
  standalone: true,
  imports: [InputComponent],
  template: `<app-input
    [type]="type"
    [placeholder]="placeholder"
    [name]="name"
    [id]="id"
    [disabled]="disabled"
    [error]="error"
    [valid]="valid"
  ></app-input>`
})
class TestHostComponent {
  type = 'email';
  placeholder = 'Your email';
  name = 'email';
  id = 'test-input';
  disabled = false;
  error = false;
  valid = false;
}

describe('InputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent] // tout standalone va dans imports
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the placeholder', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.attributes['placeholder']).toBe('Your email');
  });

  it('should accept typing', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('test@example.com');
  });

  it('should be disabled when [disabled]=true', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.disabled).toBeTrue();
  });

  it('should have input-error class when [error]=true', () => {
    hostComponent.error = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.classList).toContain('input-error');
  });

  it('should have input-valid class when [valid]=true', () => {
    hostComponent.valid = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.classList).toContain('input-valid');
  });

  it('should have the correct type', () => {
    hostComponent.type = 'password';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.type).toBe('password');
  });
});