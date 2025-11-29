import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  
  mockProjects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Platform Redesign',
      description: 'Complete redesign of the e-commerce platform with modern UI/UX',
      marketId: 1,
      status: 'IN_PROGRESS',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-12-31'),
      progress: 65
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android',
      marketId: 1,
      status: 'IN_PROGRESS',
      startDate: new Date('2025-10-01'),
      progress: 40
    }
  ];

  marketNames: { [key: number]: string } = {
    1: 'Technology',
    2: 'Healthcare',
    3: 'Finance',
    4: 'E-commerce',
    5: 'Education'
  };

  relatedTasks = [
    { id: 1, title: 'Setup development environment', status: 'DONE', priority: 'HIGH' },
    { id: 2, title: 'Design database schema', status: 'DONE', priority: 'HIGH' },
    { id: 3, title: 'Implement user authentication', status: 'IN_PROGRESS', priority: 'URGENT' },
    { id: 4, title: 'Create product catalog', status: 'TODO', priority: 'MEDIUM' },
    { id: 5, title: 'Payment gateway integration', status: 'TODO', priority: 'HIGH' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.project = this.mockProjects.find(p => p.id === id) || null;
  }

  getMarketName(marketId: number): string {
    return this.marketNames[marketId] || 'Unknown';
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    const colors: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'PLANNING': 'accent',
      'IN_PROGRESS': 'primary',
      'COMPLETED': 'primary',
      'ON_HOLD': 'warn'
    };
    return colors[status] || 'primary';
  }

  deleteProject(): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.router.navigate(['/projects']);
    }
  }
}