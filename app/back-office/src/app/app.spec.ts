import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';

describe('App', () => {
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = { url: '/login' };
    await TestBed.configureTestingModule({
      imports: [
        App,
        TranslateModule.forRoot()
      ],
      providers: [
				{ provide: Router, useValue: mockRouter },
				provideMockStore({})
			]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should return true for isLoginPage() if url is /login', () => {
    mockRouter.url = '/login';
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isLoginPage()).toBeTrue();
  });

  it('should return false for isLoginPage() if url is not /login', () => {
    mockRouter.url = '/dashboard';
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isLoginPage()).toBeFalse();
  });
});