import { IconComponent } from '#common/ui/icon/icon';
import { ItemPreviewComponent } from '#common/ui/item-preview/item-preview';
import { LevelBarComponent } from '#common/ui/level-bar/level-bar';
import { formatDate } from '#SUtils/date.utils';
import { capitalizeFirstLetter } from '#SUtils/string.utils';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
		ItemPreviewComponent,
		IconComponent,
		LevelBarComponent
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class TableComponent {
  private _columns: { key: string, label: string }[] = [];

	@Input()
	set columns(cols: { key: string, label: string }[]) {
		this._columns = cols?.map(col => ({
			...col,
			label: capitalizeFirstLetter(this.translate.instant(col.label))
		})) ?? [];
	}
	get columns() {
		return this._columns;
	}

  @Input() data: any[] = [];
  @Input() showActions = false;

  @Output() rowClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() updateClick = new EventEmitter<any>();

	constructor(
		private translate: TranslateService
	) {}

	trackById(index: number, item: any) {
		return item.id;
	}

	formatCell(value: any): string {
    if (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      return formatDate(value, 'long', this.translate.currentLang || this.translate.defaultLang);
    }
    if (value instanceof Date) {
      return formatDate(value, 'long', this.translate.currentLang || this.translate.defaultLang);
    }
    return value;
	}

	formatTypes(types: string[]): string {
		if (!types || types.length === 0) return '';
		
		return types.map(type => type.toUpperCase()).join(', ');
	}

  onRowClick(row: any) {
		console.log('Row clicked:', row);
    this.rowClick.emit(row);
  }

	getLogo(picture: any): string | null {
		if (!picture) return null;
		if (typeof picture === 'string') {
			return picture.startsWith('http') ? picture : `assets/images/${picture}`;
		}
		if (picture instanceof File) {
			return URL.createObjectURL(picture);
		}
		if (picture.url) {
			return picture.url.startsWith('http') ? picture.url : `assets/images/${picture.url}`;
		}
		return null;
	}

  onDeleteClick(row: any, event: MouseEvent) {
    event.stopPropagation();
    this.deleteClick.emit(row);
  }

  onUpdateClick(row: any, event: MouseEvent) {
    event.stopPropagation();
    this.updateClick.emit(row);
  }
}