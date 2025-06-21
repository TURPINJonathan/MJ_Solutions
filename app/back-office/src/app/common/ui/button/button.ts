import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
	imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray' = 'primary';
	@Input() loading: boolean = false;
}