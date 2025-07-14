import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToggleComponent } from './toggle';

describe('ToggleComponent', () => {
  let component: ToggleComponent;
  let fixture: ComponentFixture<ToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label when showLabel is true', () => {
    component.label = 'Test Label';
    component.showLabel = true;
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.toggle-label'));
    expect(labelEl.nativeElement.textContent).toContain('Test Label');
  });

  it('should not display the label when showLabel is false', () => {
    component.label = 'Hidden Label';
    component.showLabel = false;
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.toggle-label'));
    expect(labelEl).toBeNull();
  });

  it('should emit checkedChange with true when toggled from false', () => {
    component.checked = false;
    spyOn(component.checkedChange, 'emit');
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    inputEl.triggerEventHandler('change');
    expect(component.checkedChange.emit).toHaveBeenCalledWith(true);
    expect(component.checked).toBeTrue();
  });

  it('should emit checkedChange with false when toggled from true', () => {
    component.checked = true;
    spyOn(component.checkedChange, 'emit');
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    inputEl.triggerEventHandler('change');
    expect(component.checkedChange.emit).toHaveBeenCalledWith(false);
    expect(component.checked).toBeFalse();
  });

  it('should reflect checked input state', () => {
    component.checked = true;
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(inputEl.nativeElement.checked).toBeTrue();

    component.checked = false;
    fixture.detectChanges();
    expect(inputEl.nativeElement.checked).toBeFalse();
  });
});