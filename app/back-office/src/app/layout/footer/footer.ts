import { LanguageSwitcherComponent } from '#BO/common/ui/language-switcher/language-switcher';
import { SwitchModeComponent } from '#BO/common/ui/switch-mode/switch-mode';
import { AuthService } from '#BO/services/auth/auth.service';
import { ToastUtils } from '#BO/utils/toastUtils';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
	imports: [
		SwitchModeComponent,
		LanguageSwitcherComponent
	]
})
export class Footer {
	constructor(
		private readonly authService: AuthService,
		private readonly router: Router,
		private readonly toast: ToastUtils,
		private translate: TranslateService
	) {}

  currentYear = new Date().getFullYear();

	logout() {
		const refreshToken = localStorage.getItem('refreshToken');
		this.authService.logout(refreshToken).subscribe({
			next: () => {
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
				this.toast.success(this.translate.instant('LOGOUT.SUCCESS'), this.translate.instant('LOGOUT.TITLE'));
				this.router.navigate(['/login']);
			},
			error: (error) => {
				this.toast.error(this.translate.instant('LOGOUT.ERROR'), this.translate.instant('LOGOUT.TITLE'));
				console.error('Logout error:', error);
			}
		})
	}

}