import { ButtonComponent } from '#common/ui/button/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog',
	standalone: true,
  imports: [
		CommonModule,
		ButtonComponent,
		TranslateModule
	],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss'
})
export class DialogComponent {
  @Input() open = false;
	@Input() header?: string;
  @Output() closed = new EventEmitter<void>();

	isClosing = false;
	isFullscreen = false;

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  close() {
    this.isClosing = true;
    setTimeout(() => {
      this.isClosing = false;
      this.closed.emit();
    }, 350);
  }
}
