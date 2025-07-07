// app.routes.ts
import { AuthGuard } from '#guards/auth-guard';
import { CompagnyPage } from '#pages/compagny/compagny';
import { DashboardPage } from '#pages/dashboard/dashboard';
import { LoginPage } from '#pages/login/login';
import { TechnologyPage } from '#pages/technology/technology';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardPage },
			{ path: 'compagny', component: CompagnyPage},
			{ path: 'technology', component: TechnologyPage },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];