import { CardComponent } from '#BO/common/ui/card/card';
import { FormComponent } from '#BO/common/ui/form/form';
import { ToastUtils } from '#BO/utils/toastUtils';
import { AuthService } from '#services/auth/auth.service';
import { isValidEmail, isValidPassword } from '#shared/utils/validation.utils';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../common/ui/button/button';
import { InputComponent } from '../../common/ui/input/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputComponent, ButtonComponent, CardComponent, FormComponent],
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
    private readonly toast: ToastUtils
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
      this.toast.warning('Veuillez remplir tous les champs.', 'Connexion');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.token) {
          localStorage.setItem('token', res.token);
          this.toast.success('Connexion réussie !', 'Connexion');
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error('Vos identifiants sont incorrects.', 'Erreur lors de la connexion');
        }
      },
      error: (err) => {
				console.error('Login error:', err);
        this.isLoading = false;
        this.toast.error('Vos identifiants sont peut-être incorrects.', 'Erreur lors de la connexion');
      }
    });
  }
}