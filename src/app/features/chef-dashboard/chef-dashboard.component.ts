import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { TaskService } from '../../core/services/task.service';
import { EmployeeService } from '../../core/services/employee.service';
import { ServiceService } from '../../core/services/service.service';
import { Task, TaskState, TaskPriority, Employee } from '../../core/models/task.model';
import { Service } from '../../core/models/service.model';
import { ApprovalDialogComponent } from '../tasks/approval-dialog/approval-dialog.component';

interface DepartmentStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  urgentTasks: number;
}

@Component({
  selector: 'app-chef-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    BaseChartDirective
  ],
  templateUrl: './chef-dashboard.component.html',
  styleUrls: ['./chef-dashboard.component.scss']
})
export class ChefDashboardComponent implements OnInit {
  currentChef: Employee | null = null;
  departmentService: Service | null = null;
  departmentTasks: Task[] = [];
  departmentEmployees: Employee[] = [];
  stats: DepartmentStats = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    urgentTasks: 0
  };

  displayedColumns: string[] = ['titre', 'responsable', 'echeance', 'priorite', 'etat', 'actions'];
  isLoading = false;

  taskStatusChart: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Validées', 'En cours', 'En attente', 'Non validées'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336']
    }]
  };

  taskStatusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  employeeWorkloadChart: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Tâches assignées',
      data: [],
      backgroundColor: '#1976d2'
    }]
  };

  employeeWorkloadChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  constructor(
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private serviceService: ServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadChefData();
  }

  loadChefData(): void {
  this.isLoading = true;
  console.log('=== Starting loadChefData ===');
  
  const userStr = localStorage.getItem('currentUser');
  console.log('User from localStorage:', userStr);
  
  if (!userStr) {
    console.error('No user logged in');
    this.useMockData();
    return;
  }

  const user = JSON.parse(userStr);
  console.log('Parsed user:', user);
  
  // Try to get employee ID from various possible fields
  const chefId = user.id_employe || user.id || user.employeeId || 1;
  console.log('Attempting to load chef with ID:', chefId);

  // Add timeout to prevent infinite loading
  const timeout = setTimeout(() => {
    console.warn('API call timeout - switching to mock data');
    this.useMockData();
  }, 5000); // 5 second timeout

  this.employeeService.getEmployee(chefId).subscribe({
    next: (chef: Employee) => {
      clearTimeout(timeout);
      console.log('✅ Chef loaded successfully:', chef);
      this.currentChef = chef;
      
      if (chef.id_service) {
        console.log('Loading department data for service:', chef.id_service);
        this.loadDepartmentData(chef.id_service);
      } else {
        console.warn('Chef has no service assigned');
        this.useMockData();
      }
    },
    error: (error: any) => {
      clearTimeout(timeout);
      console.error('❌ Error loading chef data:', error);
      console.log('Error status:', error.status);
      console.log('Error message:', error.message);
      console.log('Switching to mock data');
      this.useMockData();
    }
  });
}

loadDepartmentData(serviceId: number): void {
  console.log('=== Loading department data for service:', serviceId, '===');
  
  // Load service details
  this.serviceService.getService(serviceId).subscribe({
    next: (service: Service) => {
      console.log('✅ Service loaded:', service);
      this.departmentService = service;
    },
    error: (error: any) => {
      console.error('❌ Error loading service:', error);
      console.log('Continuing with mock service data');
      this.departmentService = {
        id_service: serviceId,
        nom: 'Département (Mode Démo)',
        description: 'Service chargé en mode démo',
        chef_service: 1
      };
    }
  });

  // Load department employees
  this.employeeService.getAllEmployees().subscribe({
    next: (employees: Employee[]) => {
      console.log('✅ All employees loaded:', employees.length);
      this.departmentEmployees = employees.filter((emp: Employee) => emp.id_service === serviceId);
      console.log('Filtered department employees:', this.departmentEmployees.length);
      
      if (this.departmentEmployees.length === 0) {
        console.warn('No employees found for this service, using mock data');
        this.useMockData();
      } else {
        this.loadDepartmentTasks();
      }
    },
    error: (error: any) => {
      console.error('❌ Error loading employees:', error);
      this.useMockData();
    }
  });
}

loadDepartmentTasks(): void {
  console.log('=== Loading department tasks ===');
  
  this.taskService.getTasks().subscribe({
    next: (tasks: Task[]) => {
      console.log('✅ All tasks loaded:', tasks.length);
      const employeeIds = this.departmentEmployees.map(emp => emp.id_employe!);
      console.log('Employee IDs in department:', employeeIds);
      
      this.departmentTasks = tasks
        .filter((task: Task) => {
          const responsableId = typeof task.responsable === 'number' 
            ? task.responsable 
            : task.responsable?.id_employe;
          return responsableId && employeeIds.includes(responsableId);
        })
        .map((task: Task) => {
          const responsableId = typeof task.responsable === 'number' 
            ? task.responsable 
            : task.responsable?.id_employe;
          return {
            ...task,
            responsableDetails: this.departmentEmployees.find(emp => emp.id_employe === responsableId)
          };
        })
        .sort((a: Task, b: Task) => 
          new Date(a.date_fin).getTime() - new Date(b.date_fin).getTime()
        );

      console.log('Filtered tasks for department:', this.departmentTasks.length);
      
      if (this.departmentTasks.length === 0) {
        console.warn('No tasks found for this department');
      }

      this.calculateStats();
      this.updateCharts();
      this.isLoading = false;
      console.log('=== Dashboard loaded successfully ===');
    },
    error: (error: any) => {
      console.error('❌ Error loading tasks:', error);
      this.useMockData();
    }
  });
}

  calculateStats(): void {
    const tasks = this.departmentTasks;
    const now = new Date();

    this.stats.totalTasks = tasks.length;
    this.stats.completedTasks = tasks.filter(t => 
      t.etat === TaskState.VALIDEE || t.etat === 'Validée'
    ).length;
    this.stats.pendingTasks = tasks.filter(t => 
      t.etat === TaskState.EN_ATTENTE || t.etat === 'En attente'
    ).length;
    this.stats.urgentTasks = tasks.filter(t => 
      t.priorite === TaskPriority.URGENT || t.priorite === 'Urgent'
    ).length;
    
    this.stats.overdueTasks = tasks.filter(t => {
      const deadline = new Date(t.date_fin);
      return deadline < now && t.etat !== TaskState.VALIDEE && t.etat !== 'Validée';
    }).length;

    this.stats.completionRate = this.stats.totalTasks > 0
      ? Math.round((this.stats.completedTasks / this.stats.totalTasks) * 100)
      : 0;
  }

  updateCharts(): void {
    const tasks = this.departmentTasks;
    this.taskStatusChart.datasets[0].data = [
      tasks.filter(t => t.etat === 'Validée' || t.etat === TaskState.VALIDEE).length,
      tasks.filter(t => t.etat === 'En cours' || t.etat === TaskState.EN_COURS).length,
      tasks.filter(t => t.etat === 'En attente' || t.etat === TaskState.EN_ATTENTE).length,
      tasks.filter(t => t.etat === 'Non validée' || t.etat === TaskState.NON_VALIDEE).length
    ];

    const workloadMap = new Map<number, number>();
    this.departmentEmployees.forEach(emp => workloadMap.set(emp.id_employe!, 0));
    
    tasks.forEach(task => {
      const responsableId = typeof task.responsable === 'number' 
        ? task.responsable 
        : task.responsable?.id_employe;
      if (responsableId) {
        const count = workloadMap.get(responsableId) || 0;
        workloadMap.set(responsableId, count + 1);
      }
    });

    this.employeeWorkloadChart.labels = this.departmentEmployees.map(emp => 
      `${emp.prenom} ${emp.nom}`
    );
    this.employeeWorkloadChart.datasets[0].data = this.departmentEmployees.map(emp =>
      workloadMap.get(emp.id_employe!) || 0
    );
  }

  openApprovalDialog(task: Task): void {
    const dialogRef = this.dialog.open(ApprovalDialogComponent, {
      width: '500px',
      data: {
        taskId: task.id_tache,
        taskTitle: task.titre
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartmentTasks();
      }
    });
  }

  getTaskPriorityColor(priorite: string): string {
    switch (priorite) {
      case 'Urgent': return 'warn';
      case 'Quotidien': return 'accent';
      case 'Informatif': return 'primary';
      default: return 'primary';
    }
  }

  getTaskStateColor(etat: string): string {
    switch (etat) {
      case 'Validée': return 'primary';
      case 'En cours': return 'accent';
      case 'En attente': return 'warn';
      case 'Non validée': return 'warn';
      default: return 'primary';
    }
  }

  isTaskOverdue(task: Task): boolean {
    const deadline = new Date(task.date_fin);
    const now = new Date();
    return deadline < now && task.etat !== 'Validée';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getResponsableName(task: Task): string {
    if (task.responsableDetails) {
      return `${task.responsableDetails.prenom} ${task.responsableDetails.nom}`;
    }
    return 'Non assigné';
  }

  useMockData(): void {
    this.departmentService = {
      id_service: 1,
      nom: 'Département IT',
      description: 'Services informatiques',
      chef_service: 1
    };

    this.stats = {
      totalTasks: 25,
      completedTasks: 18,
      pendingTasks: 5,
      overdueTasks: 2,
      completionRate: 72,
      urgentTasks: 3
    };

    this.isLoading = false;
  }
}