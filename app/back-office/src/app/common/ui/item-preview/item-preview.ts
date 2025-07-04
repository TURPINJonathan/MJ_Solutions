import { environment } from '#env/environment';
import { Picture } from '#shared/models/picture.model';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-item-preview',
  standalone: true,
	imports: [
		CommonModule
	],
  templateUrl: './item-preview.html',
  styleUrl: './item-preview.scss'
})
export class ItemPreviewComponent implements OnChanges, OnDestroy {
  @Input() picture: Picture | File | null = null;
  @Input() color!: string;
  @Input() title!: string;
  @Input() content!: string;
	@Input() size: number = 64;

  imageUrl: string | null = null;
  private objectUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['picture']) {
      this.updateImageUrl();
    }
  }

  ngOnDestroy() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  private updateImageUrl() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    if (!this.picture) {
      this.imageUrl = null;
    } else if (this.picture instanceof File) {
      this.objectUrl = URL.createObjectURL(this.picture);
      this.imageUrl = this.objectUrl;
    } else if ('url' in this.picture) {
			this.imageUrl = this.picture.url.startsWith('http')
				? this.picture.url
				: environment.apiUrl + this.picture.url;
    } else {
      this.imageUrl = null;
    }
  }
}