import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { InputComponent } from '#common/ui/input/input';

@Component({
  template: `<app-input
    [type]="type"
    [placeholder]="placeholder"
    [name]="name"
    [id]="id"
    [disabled]="disabled"
  ></app-input>`
})
class TestHostComponent {
  type = 'email';
  placeholder = 'Your email';
  name = 'email';
  id = 'test-input';
  disabled = false;
}

describe('InputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent, TestHostComponent]
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
});
