import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[]; // Définit les rôles autorisés pour cet élément
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
export class SidebarComponent implements OnInit { // Implémenter OnInit
  @Input() isOpen = true;

  private authService = inject(AuthService); // Injecter le service d'authentification

  // Liste complète de tous les éléments de menu avec les droits d'accès
  private allMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: [UserRole.ADMIN] },
    { icon: 'supervisor_account', label: 'Chef Dashboard', route: '/chef-dashboard', roles: [UserRole.CHEF] },
    { label: 'Markets', icon: 'store', route: '/markets', roles: [UserRole.ADMIN,UserRole.CHEF,UserRole.EMPLOYE] },
    { label: 'Tasks', icon: 'task', route: '/tasks', roles: [UserRole.EMPLOYE] },
    { label: 'Employees', icon: 'people', route: '/employees', roles: [UserRole.CHEF,UserRole.ADMIN] },
    { label: 'Services', icon: 'business', route: '/services', roles: [UserRole.ADMIN] },
    { label: 'Statistics', icon: 'bar_chart', route: '/statistics', roles: [UserRole.ADMIN, UserRole.CHEF] }
  ];

  // Liste affichée dans le template
  menuItems: MenuItem[] = []; 

  ngOnInit(): void {
    this.filterMenuItemsByRole();
  }

  filterMenuItemsByRole(): void {
    const currentUser = this.authService.getCurrentUser();
    
    // Si aucun utilisateur n'est connecté, n'afficher rien
    if (!currentUser) {
      this.menuItems = [];
      return;
    }

    const userRole = currentUser.role;

    // Filtrer les éléments de menu en fonction du rôle de l'utilisateur
    this.menuItems = this.allMenuItems.filter(item => 
      item.roles.includes(userRole)
    );
  }
}