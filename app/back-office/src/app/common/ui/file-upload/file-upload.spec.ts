import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadComponent } from './file-upload';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FileUploadComponent,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    component.label = 'Ajouter un fichier';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button.nativeElement.textContent).toContain('Ajouter un fichier');
  });

  it('should emit fileSelected and show file name on file input change', () => {
    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
    spyOn(component.fileSelected, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement as HTMLInputElement;

    const event = { target: { files: [file] } } as any;
    component.onFileChange(event);
    fixture.detectChanges();

    expect(component.file).toBe(file);
    expect(component.fileSelected.emit).toHaveBeenCalledWith(file);

    const fileName = fixture.debugElement.query(By.css('.file-name'));
    expect(fileName.nativeElement.textContent).toContain('foo.txt');
  });

	it('should show preview for image files', (done) => {
		const file = new File(['dummy image data'], 'image.png', { type: 'image/png' });
		spyOn(component.fileSelected, 'emit');
		component.setFile(file);

		setTimeout(() => {
			expect(component.previewUrl).toContain('data:image/png');
			done();
		}, 50);
	});

  it('should set isDragOver to true on dragover and false on dragleave', () => {
    const dragOverEvent = new DragEvent('dragover');
    const dragLeaveEvent = new DragEvent('dragleave');
    component.onDragOver(dragOverEvent);
    expect(component.isDragOver).toBeTrue();
    component.onDragLeave(dragLeaveEvent);
    expect(component.isDragOver).toBeFalse();
  });

  it('should call triggerInput and open file dialog', () => {
    const input = document.createElement('input');
    spyOn(input, 'click');
    component.triggerInput(input);
    expect(input.click).toHaveBeenCalled();
  });

  it('should handle file drop', () => {
    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
    spyOn(component, 'setFile');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const event = new DragEvent('drop', { dataTransfer });
    Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
    component.onDrop(event);
    expect(component.setFile).toHaveBeenCalledWith(file);
    expect(component.isDragOver).toBeFalse();
  });
});