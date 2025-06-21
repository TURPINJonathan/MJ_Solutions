import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from '#common/ui/button/button';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<app-button [type]="type" [color]="color" [disabled]="disabled" [loading]="loading" id="test-btn">{{text}}</app-button>`
})
class TestHostComponent {
  type = 'submit';
  color = 'primary';
  disabled = false;
  loading = false;
  text = 'Sign in';
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent] // TestHostComponent est standalone
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the button text', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.textContent.trim()).toBe('Sign in');
  });

  it('should be disabled when [disabled]=true', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeTrue();
  });

  it('should be disabled when [loading]=true', () => {
    hostComponent.loading = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeTrue();
  });

  it('should have the correct type', () => {
    hostComponent.type = 'reset';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.type).toBe('reset');
  });

  it('should apply the correct color class', () => {
    hostComponent.color = 'secondary';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.classList).toContain('button-secondary');
  });
});