import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ChefDashboardComponent } from './features/chef-dashboard/chef-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
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
        path: 'tasks',
        loadComponent: () => import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
      },
      {
      path: 'employees',
      loadComponent: () => import('./features/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
    },
    {
  path: 'services',
  loadComponent: () => import('./features/services/service-list/service-list.component').then(m => m.ServiceListComponent)
},
{
  path: 'statistics',
  loadComponent: () => import('./features/statistics/statistics.component').then(m => m.StatisticsComponent)
},
{ path: 'chef-dashboard', component: ChefDashboardComponent },
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];