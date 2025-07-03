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
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray' = 'primary';
	@Input() size?: 'xs' | 'sm' | 'md' | 'lg';
	@Input() loading: boolean = false;
	@Input() rounded: boolean = false;
	@Input() width?: number;
	@Input() height?: number;
}