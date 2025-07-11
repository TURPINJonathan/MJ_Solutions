import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LevelBarComponent } from './level-bar';

describe('LevelBarComponent', () => {
  let component: LevelBarComponent;
  let fixture: ComponentFixture<LevelBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LevelBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct value and label', () => {
    component.value = 42;
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.proficiency-label')).nativeElement;
    expect(label.textContent).toContain('42%');
    const fill = fixture.debugElement.query(By.css('.proficiency-fill')).nativeElement;
    expect(fill.style.width).toContain('42%');
  });

  it('should apply the correct color', () => {
    component.color = '#ff0000';
    fixture.detectChanges();
    const bar = fixture.debugElement.query(By.css('.proficiency-bar')).nativeElement;
    expect(bar.style.borderColor).toBe('rgb(255, 0, 0)');
    const fill = fixture.debugElement.query(By.css('.proficiency-fill')).nativeElement;
    expect(fill.style.background).toBe('rgb(255, 0, 0)');
  });

  it('should have editable class in edit mode', () => {
    component.mode = 'edit';
    fixture.detectChanges();
    const bar = fixture.debugElement.query(By.css('.proficiency-bar')).nativeElement;
    expect(bar.classList).toContain('editable');
  });

  it('should not have editable class in show mode', () => {
    component.mode = 'show';
    fixture.detectChanges();
    const bar = fixture.debugElement.query(By.css('.proficiency-bar')).nativeElement;
    expect(bar.classList).not.toContain('editable');
  });

  it('should emit valueChange on mouse down in edit mode', () => {
    component.mode = 'edit';
    fixture.detectChanges();
    spyOn(component.valueChange, 'emit');
    const bar = fixture.debugElement.query(By.css('.proficiency-bar')).nativeElement;
    const event = new MouseEvent('mousedown', { clientX: bar.getBoundingClientRect().left + 40 });
    bar.dispatchEvent(event);
    expect(component.valueChange.emit).toHaveBeenCalled();
  });

  it('should not emit valueChange on mouse down in show mode', () => {
    component.mode = 'show';
    fixture.detectChanges();
    spyOn(component.valueChange, 'emit');
    const bar = fixture.debugElement.query(By.css('.proficiency-bar')).nativeElement;
    const event = new MouseEvent('mousedown', { clientX: bar.getBoundingClientRect().left + 40 });
    bar.dispatchEvent(event);
    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });
});