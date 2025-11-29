import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'markets',
        loadComponent: () => import('./features/markets/market-list/market-list.component').then(m => m.MarketListComponent)
      },
      {
        path: 'markets/:id',
        loadComponent: () => import('./features/markets/market-detail/market-detail.component').then(m => m.MarketDetailComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];