import { ButtonComponent } from '#common/ui/button/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
	imports: [
		ButtonComponent,
		CommonModule,
		TranslateModule
	],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss'
})
export class FileUploadComponent {
  @Input() accept: string = '*/*';
  @Input() label: string = 'Choisir un fichier';
  @Output() fileSelected = new EventEmitter<File>();

  file?: File;
  previewUrl?: string | ArrayBuffer | null;
  isDragOver = false;

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.setFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  setFile(file: File) {
    this.file = file;
    this.fileSelected.emit(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = undefined;
    }
  }

  triggerInput(input: HTMLInputElement) {
    input.click();
  }
}