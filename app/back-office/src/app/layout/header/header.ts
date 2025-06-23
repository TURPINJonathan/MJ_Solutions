import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
	imports: [
		TranslateModule,
	]
})
export class Header {
  menuOpen = false;
	MJSLogo = 'assets/pictures/MJS_logo.png';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}