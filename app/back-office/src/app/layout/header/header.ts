import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule,
	]
})
export class Header {
  menuOpen = false;
	activeSubMenu: string | null = null;
	MJSLogo = 'assets/pictures/MJS_logo.png';

	menus = [
		{
			label: 'DASHBOARD.TITLE',
			route: '/dashboard'
		},
    {
      label: 'PROJECTS.TITLE',
      route: '/dashboard',
    },
    {
      label: 'CV.TITLE.SINGLE',
      subMenu: [
        { label: 'COMPAGNY.TITLE.PLURAL', route: '/compagny' },
				{ label: 'TECHNOLOGY.TITLE.PLURAL', route: '/technology' },
      ]
    },
    {
      label: 'SETTINGS.TITLE',
      route: '/dashboard',
    },
	]

	get activeSubMenuItems() {
		return this.menus.find(m => m.label === this.activeSubMenu)?.subMenu ?? [];
	}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) this.activeSubMenu = null;
  }

  closeMenu() {
    this.menuOpen = false;
    this.activeSubMenu = null;
  }

  openSubMenu(menuLabel: string, event: Event) {
    event.preventDefault();
    this.activeSubMenu = menuLabel;
  }

  closeSubMenu(event: Event) {
    event.preventDefault();
    this.activeSubMenu = null;
  }
}