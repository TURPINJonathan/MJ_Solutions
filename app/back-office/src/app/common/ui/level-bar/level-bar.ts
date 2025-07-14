import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-level-bar',
  imports: [],
  templateUrl: './level-bar.html',
  styleUrl: './level-bar.scss'
})
export class LevelBarComponent {
  @Input() value: number = 0;
	@Input() mode: 'show' | 'edit' = 'show';
  @Input() color?: string;
  @Output() valueChange = new EventEmitter<number>();

  private dragging = false;

  onBarMouseDown(event: MouseEvent) {
    if (this.mode !== 'edit') return;
    this.dragging = true;
    this.updateValueFromEvent(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging && this.mode === 'edit') {
      this.updateValueFromEvent(event);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
  }

  private updateValueFromEvent(event: MouseEvent) {
    const bar = (event.target as HTMLElement).closest('.proficiency-bar');
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    let percent = ((event.clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, Math.round(percent)));
    this.value = percent;
    this.valueChange.emit(this.value);
  }

  get backgroundColor(): string {
    return 'var(--color-bg)';
  }

	get labelColor(): string {
		return this.value > 45 ? '#fff' : '#222';
	}
}