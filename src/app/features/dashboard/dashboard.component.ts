import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarketService } from '../../core/services/market.service';
import { TaskService } from '../../core/services/task.service';
import { Market } from '../../core/models/market.model';
import { Task } from '../../core/models/task.model';

interface DashboardStats {
  totalMarkets: number;
  activeMarkets: number;
  pendingTasks: number;
  completedTasks: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalMarkets: 0,
    activeMarkets: 0,
    pendingTasks: 0,
    completedTasks: 0
  };

  recentMarkets: Market[] = [];
  upcomingTasks: Task[] = [];
  isLoading = false;

  constructor(
    private marketService: MarketService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.loadMarkets();
    this.loadTasks();
  }

  loadMarkets(): void {
    this.marketService.getAllMarkets().subscribe({
      next: (markets) => {
        this.stats.totalMarkets = markets.length;
        this.stats.activeMarkets = markets.filter(m => m.statut === 'En Cours').length;
        this.recentMarkets = markets
          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading markets:', error);
      }
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.stats.pendingTasks = tasks.filter(t => t.etat === 'En attente').length;
        this.stats.completedTasks = tasks.filter(t => t.etat === 'Validée').length;
        
        this.upcomingTasks = tasks
          .filter(t => t.etat !== 'Validée')
          .sort((a, b) => new Date(a.date_fin).getTime() - new Date(b.date_fin).getTime())
          .slice(0, 5);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'En Cours':
        return 'primary';
      case 'Terminé':
        return 'accent';
      case 'En Préparation':
        return 'warn';
      case 'Annulé':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    return status;
  }

  getMarketStatusColor(status: string): string {
    return this.getStatusColor(status);
  }

  getPriorityColor(priorite: string): string {
    switch (priorite) {
      case 'Urgent':
        return 'warn';
      case 'Quotidien':
        return 'accent';
      case 'Informatif':
        return 'primary';
      default:
        return 'primary';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  isTaskOverdue(task: Task): boolean {
    const deadline = new Date(task.date_fin);
    const now = new Date();
    return deadline < now && task.etat !== 'Validée';
  }
}