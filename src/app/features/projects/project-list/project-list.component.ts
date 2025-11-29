import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Project } from '../../../core/models/project.model';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'market', 'status', 'progress', 'startDate', 'actions'];
  
  projects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Platform Redesign',
      description: 'Complete redesign of the e-commerce platform',
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
    },
    {
      id: 3,
      name: 'Marketing Campaign Q4',
      description: 'Q4 marketing campaign planning and execution',
      marketId: 4,
      status: 'PLANNING',
      startDate: new Date('2025-11-01'),
      progress: 15
    },
    {
      id: 4,
      name: 'Data Analytics Dashboard',
      description: 'Business intelligence dashboard for analytics',
      marketId: 1,
      status: 'IN_PROGRESS',
      startDate: new Date('2025-08-15'),
      progress: 80
    },
    {
      id: 5,
      name: 'Customer Portal',
      description: 'Self-service customer portal implementation',
      marketId: 1,
      status: 'COMPLETED',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-08-30'),
      progress: 100
    },
    {
      id: 6,
      name: 'Security Audit',
      description: 'Comprehensive security audit and remediation',
      marketId: 3,
      status: 'ON_HOLD',
      startDate: new Date('2025-09-15'),
      progress: 25
    }
  ];

  // Mock market names
  marketNames: { [key: number]: string } = {
    1: 'Technology',
    2: 'Healthcare',
    3: 'Finance',
    4: 'E-commerce',
    5: 'Education'
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projects = [...this.projects, result as Project];
        console.log('Project created:', result);
      }
    });
  }

  openEditDialog(project: Project): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '600px',
      data: { project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.projects.findIndex(p => p.id === result.id);
        if (index !== -1) {
          this.projects[index] = result;
          this.projects = [...this.projects];
        }
        console.log('Project updated:', result);
      }
    });
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

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects = this.projects.filter(p => p.id !== id);
      console.log('Project deleted:', id);
    }
  }
}