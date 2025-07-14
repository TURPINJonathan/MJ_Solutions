import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
	imports: [
		CommonModule
	],
  templateUrl: './toggle.html',
  styleUrl: './toggle.scss'
})
export class ToggleComponent {
  @Input() checked = false;
  @Input() label = '';
  @Input() showLabel = true;
  @Output() checkedChange = new EventEmitter<boolean>();

  onToggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}