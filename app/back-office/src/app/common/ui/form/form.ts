import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.html',
	imports: [CommonModule],
  styleUrl: './form.scss'
})
export class FormComponent {
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() formSubmit = new EventEmitter<Event>();
  @Input() ngClass: string ='';

  onSubmit(event: Event) {
		event.preventDefault();
    if (!this.loading) {
      this.formSubmit.emit(event);
    }
  }
}