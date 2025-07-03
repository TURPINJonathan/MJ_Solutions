import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from '#common/ui/button/button';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<app-button [type]="type" [color]="color" [disabled]="disabled" [size]="size" [loading]="loading" id="test-btn">{{text}}</app-button>`
})
class TestHostComponent {
  type = 'submit';
  color = 'primary';
  disabled = false;
  loading = false;
  text = 'Sign in';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

describe('ButtonComponent', () => {
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

	it('should apply the correct size class', () => {
		hostComponent['type'] = 'button';
		(['xs', 'sm', 'md', 'lg'] as const).forEach(size => {
			(fixture.componentInstance as any).size = size;
			fixture.detectChanges();
			const button = fixture.debugElement.query(By.css('button'));
			expect(button.nativeElement.classList).toContain(`button-${size}`);
		});
	});

	it('should not apply any size class if size is not set', () => {
		(fixture.componentInstance as any).size = undefined;
		fixture.detectChanges();
		const button = fixture.debugElement.query(By.css('button'));
		expect(button.nativeElement.classList).not.toContain('button-xs');
		expect(button.nativeElement.classList).not.toContain('button-sm');
		expect(button.nativeElement.classList).not.toContain('button-md');
		expect(button.nativeElement.classList).not.toContain('button-lg');
	});
});