import { Footer } from '#layout/footer/footer';
import { Header } from '#layout/header/header';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true
})
export class App {
  constructor(public router: Router) {}
  protected title = 'back-office';

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}