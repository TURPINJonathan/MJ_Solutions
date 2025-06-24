import { Footer } from '#layout/footer/footer';
import { Header } from '#layout/header/header';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as UserActions from '#store/user/user.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true
})
export class App {
  constructor(
		public router: Router,
		private translate: TranslateService,
		private store: Store
	) {
    const browserLang = translate.getBrowserLang();
    translate.setDefaultLang('fr');
    translate.use(browserLang && ['fr', 'en'].includes(browserLang) ? browserLang : 'fr');

		if (localStorage.getItem('refreshToken')) {
			this.store.dispatch(UserActions.loadUser())
		}
	}
	
  protected title = 'back-office';

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}