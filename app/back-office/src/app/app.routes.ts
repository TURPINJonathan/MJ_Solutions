// app.routes.ts
import { AuthGuard } from '#guards/auth-guard';
import { DashboardPage } from '#pages/dashboard/dashboard';
import { LoginPage } from '#pages/login/login';
import { Routes } from '@angular/router';
import { CompagnyPage } from '#pages/compagny/compagny';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardPage },
			{ path: 'compagny', component: CompagnyPage},
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];