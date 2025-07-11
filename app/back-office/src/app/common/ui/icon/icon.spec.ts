import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconComponent } from './icon';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    component.name = 'star';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the lucide-icon with correct name', () => {
    component.name = 'star';
    fixture.detectChanges();
    const lucideElem = fixture.debugElement.query(By.css('lucide-icon'));
    expect(lucideElem).not.toBeNull();
    // Utilise toEqual pour comparer les objets
    expect(lucideElem.componentInstance.name).toEqual(component.icons['star']);
  });

  it('should apply the correct size and color', () => {
    component.name = 'star';
    component.size = 32;
    component.color = '#ff0000';
    fixture.detectChanges();
    const lucideElem = fixture.debugElement.query(By.css('lucide-icon'));
    expect(lucideElem.componentInstance.size).toBe(32);
    expect(lucideElem.componentInstance.color).toBe('#ff0000');
  });

  it('should apply the correct class', () => {
    component.name = 'star';
    component.class = 'custom-class';
    fixture.detectChanges();
    const lucideElem = fixture.debugElement.query(By.css('lucide-icon'));
    expect(lucideElem.componentInstance.class).toBe('custom-class');
  });

	it('should not render lucide-icon if name is not in icons', () => {
		component.name = 'unknown';
		fixture.detectChanges();
		const lucideElem = fixture.debugElement.query(By.css('lucide-icon'));
		expect(lucideElem).toBeNull();
	});
});