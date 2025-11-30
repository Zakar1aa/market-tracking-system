import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = true;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { icon: 'supervisor_account', label: 'Chef Dashboard', route: '/chef-dashboard' },
    { label: 'Markets', icon: 'store', route: '/markets' },
    { label: 'Tasks', icon: 'task', route: '/tasks' },
    { label: 'Employees', icon: 'people', route: '/employees' },
    { label: 'Services', icon: 'business', route: '/services' },
    { label: 'Statistics', icon: 'bar_chart', route: '/statistics' }
  ];
}