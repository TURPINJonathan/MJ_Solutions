import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CardComponent } from './card';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `<app-card [class]="customClass">Contenu test</app-card>`
})
class TestHostComponent {
  customClass = 'extra-class';
}

describe('CardComponent', () => {
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

  it('should create the host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should render projected content', () => {
    const card = fixture.nativeElement.querySelector('.card');
    expect(card.textContent).toContain('Contenu test');
  });

  it('should apply custom class', () => {
    const card = fixture.nativeElement.querySelector('.card');
    expect(card.classList).toContain('extra-class');
  });

  it('should have the base card class', () => {
    const card = fixture.nativeElement.querySelector('.card');
    expect(card.classList).toContain('card');
  });
});