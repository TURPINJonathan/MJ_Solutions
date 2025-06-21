import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
	imports: [CommonModule],
  styleUrl: './card.scss'
})
export class CardComponent {
  @Input() class = '';
}