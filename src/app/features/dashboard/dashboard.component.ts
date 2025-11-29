import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

interface DashboardStats {
  totalMarkets: number;
  activeProjects: number;
  pendingTasks: number;
  completedTasks: number;
}

interface RecentProject {
  id: number;
  name: string;
  status: string;
  progress: number;
  market: string;
}

interface UpcomingTask {
  id: number;
  title: string;
  project: string;
  dueDate: string;
  priority: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalMarkets: 12,
    activeProjects: 28,
    pendingTasks: 45,
    completedTasks: 156
  };

  recentProjects: RecentProject[] = [
    {
      id: 1,
      name: 'E-commerce Platform Redesign',
      status: 'IN_PROGRESS',
      progress: 65,
      market: 'Technology'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      status: 'IN_PROGRESS',
      progress: 40,
      market: 'Software'
    },
    {
      id: 3,
      name: 'Marketing Campaign Q4',
      status: 'PLANNING',
      progress: 15,
      market: 'Marketing'
    },
    {
      id: 4,
      name: 'Data Analytics Dashboard',
      status: 'IN_PROGRESS',
      progress: 80,
      market: 'Analytics'
    }
  ];

  upcomingTasks: UpcomingTask[] = [
    {
      id: 1,
      title: 'Complete user authentication',
      project: 'E-commerce Platform',
      dueDate: '2025-12-02',
      priority: 'HIGH'
    },
    {
      id: 2,
      title: 'Design mobile wireframes',
      project: 'Mobile App Development',
      dueDate: '2025-12-03',
      priority: 'MEDIUM'
    },
    {
      id: 3,
      title: 'Setup analytics tracking',
      project: 'Data Analytics Dashboard',
      dueDate: '2025-12-01',
      priority: 'URGENT'
    },
    {
      id: 4,
      title: 'Review marketing content',
      project: 'Marketing Campaign Q4',
      dueDate: '2025-12-05',
      priority: 'LOW'
    }
  ];

  ngOnInit(): void {
    // Data is already initialized above with mock data
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PLANNING': 'accent',
      'IN_PROGRESS': 'primary',
      'COMPLETED': 'primary',
      'ON_HOLD': 'warn'
    };
    return colors[status] || 'primary';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'LOW': 'accent',
      'MEDIUM': 'primary',
      'HIGH': 'warn',
      'URGENT': 'warn'
    };
    return colors[priority] || 'primary';
  }
}