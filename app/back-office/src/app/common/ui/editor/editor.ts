import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-editor',
  imports: [
		QuillModule,
		FormsModule
	],
  templateUrl: './editor.html',
  styleUrl: './editor.scss'
})
export class EditorComponent {
  @Input() value = '';
  @Input() placeholder = '';
  @Output() valueChange = new EventEmitter<string>();
}
