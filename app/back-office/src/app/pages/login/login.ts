import { ButtonComponent } from '#common/ui/button/button';
import { CardComponent } from '#common/ui/card/card';
import { FormComponent } from '#common/ui/form/form';
import { InputComponent } from '#common/ui/input/input';
import { LanguageSwitcherComponent } from '#common/ui/language-switcher/language-switcher';
import { AuthService } from '#services/auth/auth.service';
import { isValidEmail, isValidPassword } from '#shared/utils/validation.utils';
import { ToastUtils } from '#utils/toastUtils';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		ButtonComponent,
		CardComponent,
		FormComponent,
		FormsModule,
		InputComponent,
		LanguageSwitcherComponent,
		TranslateModule
	],
	templateUrl: './login.html',
	styleUrl: './login.scss'
})
export class LoginPage {
  email = '';
  password = '';
  emailTouched = false;
  passwordTouched = false;
  isLoading = false;
  isValidEmail = isValidEmail;
  isValidPassword = isValidPassword;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toast: ToastUtils,
		private translate: TranslateService
  ) {}

  get emailInvalid() {
    return this.emailTouched && !isValidEmail(this.email);
  }
  get passwordInvalid() {
    return this.passwordTouched && !isValidPassword(this.password);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.emailTouched = true;
    this.passwordTouched = true;

    if (!this.email || !this.password) {
      this.toast.warning(this.translate.instant('LOGIN.ALL_FILEDS_REQUIRED'), this.translate.instant('LOGIN.CONNECTION'));
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.token) {
          localStorage.setItem('token', res.token);
          this.toast.success(this.translate.instant('LOGIN.SUCCESS'), this.translate.instant('LOGIN.CONNECTION'));
  
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error(this.translate.instant('LOGIN.CHECK_CREDENTIALS'), this.translate.instant('LOGIN.ERROR_CONNECTION'));
        }
      },
      error: (err) => {
				console.error('Login error:', err);
        this.isLoading = false;
        this.toast.error(this.translate.instant('LOGIN.CHECK_CREDENTIALS'), this.translate.instant('LOGIN.ERROR_CONNECTION'));
      }
    });
  }
}