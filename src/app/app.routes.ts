import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

// Lazy-loaded dashboard for best performance
export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../modules/features/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard], // 🔒 Protected route
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../modules/features/auth/login/login').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../modules/features/auth/signup/signup').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
