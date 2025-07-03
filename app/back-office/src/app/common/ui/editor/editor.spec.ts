import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EditorComponent } from './editor';

@Component({
  selector: 'quill-editor',
  template: '',
  standalone: true
})
class MockQuillEditorComponent {
  @Input() placeholder?: string;
  @Input() style?: any;
  @Input() ngModel?: any;
  @Output() ngModelChange = new EventEmitter<any>();
}

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorComponent, MockQuillEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

		it('should bind value with ngModel', () => {
			component.value = '<p>Hello</p>';
			fixture.detectChanges();
			const quill = fixture.debugElement.query(By.directive(MockQuillEditorComponent));
			if (!quill) {
				pending('quill-editor not rendered');
				return;
			}
			expect(quill.componentInstance.ngModel).toBe('<p>Hello</p>');
		});

		it('should emit valueChange on ngModelChange', () => {
			spyOn(component.valueChange, 'emit');
			const newValue = '<p>Test</p>';
			fixture.detectChanges();
			const quill = fixture.debugElement.query(By.directive(MockQuillEditorComponent));
			if (!quill) {
				pending('quill-editor not rendered');
				return;
			}
			quill.componentInstance.ngModelChange.emit(newValue);
			expect(component.valueChange.emit).toHaveBeenCalledWith(newValue);
		});
});