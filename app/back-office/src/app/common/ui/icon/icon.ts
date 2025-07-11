import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData, Star } from 'lucide-angular';

@Component({
  selector: 'app-icon',
	standalone: true,
  imports: [
		LucideAngularModule,
		CommonModule
	],
  templateUrl: './icon.html',
  styleUrl: './icon.scss'
})
export class IconComponent {
	@Input() name!: string;
	@Input() size: number = 24;
	@Input() color: string = 'currentColor';
	@Input() class: string = '';

	readonly icons: { [key: string]: LucideIconData} = {
		star: Star,
	}
}
