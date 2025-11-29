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
import { Task } from '../../../core/models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
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
    MatTooltipModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'project', 'status', 'priority', 'dueDate', 'actions'];
  
  tasks: Task[] = [
    {
      id: 1,
      title: 'Complete user authentication',
      description: 'Implement JWT-based authentication system',
      projectId: 1,
      assigneeId: 1,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2025-12-02'),
      createdAt: new Date('2025-11-20')
    },
    {
      id: 2,
      title: 'Design mobile wireframes',
      description: 'Create wireframes for all mobile screens',
      projectId: 2,
      assigneeId: 2,
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2025-12-03'),
      createdAt: new Date('2025-11-21')
    },
    {
      id: 3,
      title: 'Setup analytics tracking',
      description: 'Configure Google Analytics and event tracking',
      projectId: 4,
      assigneeId: 3,
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      dueDate: new Date('2025-12-01'),
      createdAt: new Date('2025-11-19')
    },
    {
      id: 4,
      title: 'Review marketing content',
      description: 'Review and approve Q4 marketing materials',
      projectId: 3,
      status: 'REVIEW',
      priority: 'LOW',
      dueDate: new Date('2025-12-05'),
      createdAt: new Date('2025-11-22')
    },
    {
      id: 5,
      title: 'Database optimization',
      description: 'Optimize database queries for better performance',
      projectId: 1,
      assigneeId: 1,
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date('2025-11-28'),
      createdAt: new Date('2025-11-15')
    },
    {
      id: 6,
      title: 'API documentation',
      description: 'Write comprehensive API documentation',
      projectId: 1,
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2025-12-10'),
      createdAt: new Date('2025-11-23')
    }
  ];

  projectNames: { [key: number]: string } = {
    1: 'E-commerce Platform',
    2: 'Mobile App Development',
    3: 'Marketing Campaign Q4',
    4: 'Data Analytics Dashboard'
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasks = [...this.tasks, result as Task];
        console.log('Task created:', result);
      }
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.tasks.findIndex(t => t.id === result.id);
        if (index !== -1) {
          this.tasks[index] = result;
          this.tasks = [...this.tasks];
        }
        console.log('Task updated:', result);
      }
    });
  }

  getProjectName(projectId: number): string {
    return this.projectNames[projectId] || 'Unknown';
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    const colors: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'TODO': 'accent',
      'IN_PROGRESS': 'primary',
      'REVIEW': 'accent',
      'DONE': 'primary'
    };
    return colors[status] || 'primary';
  }

  getPriorityColor(priority: string): 'primary' | 'accent' | 'warn' {
    const colors: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'LOW': 'accent',
      'MEDIUM': 'primary',
      'HIGH': 'warn',
      'URGENT': 'warn'
    };
    return colors[priority] || 'primary';
  }

  isOverdue(dueDate?: Date): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      console.log('Task deleted:', id);
    }
  }
}