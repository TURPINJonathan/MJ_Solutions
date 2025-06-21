import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  get isDarkMode(): boolean {
    return document.body.classList.contains('dark');
  }

  toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark');
    }
  }

}
