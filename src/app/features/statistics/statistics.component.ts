import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MarketService } from '../../core/services/market.service';
import { TaskService } from '../../core/services/task.service';
import { Market, MarketStatus } from '../../core/models/market.model';
import { Task, TaskState } from '../../core/models/task.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    BaseChartDirective
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  isLoading = true;
  markets: Market[] = [];
  tasks: Task[] = [];

  // Market Status Chart
  marketStatusChartData: ChartData<'pie'> = {
    labels: ['En Préparation', 'En Cours', 'Terminé', 'Annulé'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#FFA726', '#42A5F5', '#66BB6A', '#EF5350']
    }]
  };

  marketStatusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Marchés par Statut'
      }
    }
  };

  marketStatusChartType: ChartType = 'pie';

  // Task Status Chart
  taskStatusChartData: ChartData<'doughnut'> = {
    labels: ['En Attente', 'En Cours', 'Validée', 'Non Validée'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#FFA726', '#42A5F5', '#66BB6A', '#EF5350']
    }]
  };

  taskStatusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Tâches par État'
      }
    }
  };

  taskStatusChartType: ChartType = 'doughnut';

  // Budget Chart
  budgetChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Budget Estimé (MAD)',
      data: [],
      backgroundColor: '#42A5F5'
    }]
  };

  budgetChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Budget par Marché'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  budgetChartType: ChartType = 'bar';

  // Timeline Chart
  timelineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Marchés Créés',
        data: [],
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.1)',
        fill: true
      },
      {
        label: 'Tâches Créées',
        data: [],
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102, 187, 106, 0.1)',
        fill: true
      }
    ]
  };

  timelineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Évolution dans le Temps'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  timelineChartType: ChartType = 'line';

  // Statistics Summary
  stats = {
    totalMarkets: 0,
    totalBudget: 0,
    averageBudget: 0,
    totalTasks: 0,
    completionRate: 0,
    overdueTasksCount: 0
  };

  constructor(
    private marketService: MarketService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;

    forkJoin({
      markets: this.marketService.getAllMarkets(),
      tasks: this.taskService.getAllTasks()
    }).subscribe({
      next: (data) => {
        this.markets = data.markets;
        this.tasks = data.tasks;
        this.calculateStatistics();
        this.updateCharts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.isLoading = false;
      }
    });
  }

  calculateStatistics(): void {
    // Total markets
    this.stats.totalMarkets = this.markets.length;

    // Budget statistics
    const budgets = this.markets
      .filter(m => m.budget_estime)
      .map(m => m.budget_estime!);
    
    this.stats.totalBudget = budgets.reduce((sum, b) => sum + b, 0);
    this.stats.averageBudget = budgets.length > 0 
      ? this.stats.totalBudget / budgets.length 
      : 0;

    // Task statistics
    this.stats.totalTasks = this.tasks.length;
    
    const validatedTasks = this.tasks.filter(t => t.etat === TaskState.VALIDEE).length;
    this.stats.completionRate = this.tasks.length > 0
      ? (validatedTasks / this.tasks.length) * 100
      : 0;

    // Overdue tasks
    const today = new Date();
    this.stats.overdueTasksCount = this.tasks.filter(t => {
      if (!t.date_fin || t.etat === TaskState.VALIDEE) return false;
      return new Date(t.date_fin) < today;
    }).length;
  }

  updateCharts(): void {
    this.updateMarketStatusChart();
    this.updateTaskStatusChart();
    this.updateBudgetChart();
    this.updateTimelineChart();
  }

  updateMarketStatusChart(): void {
    const statusCounts = [
      this.markets.filter(m => m.statut === MarketStatus.EN_PREPARATION).length,
      this.markets.filter(m => m.statut === MarketStatus.EN_COURS).length,
      this.markets.filter(m => m.statut === MarketStatus.TERMINE).length,
      this.markets.filter(m => m.statut === MarketStatus.ANNULE).length
    ];

    this.marketStatusChartData.datasets[0].data = statusCounts;
  }

  updateTaskStatusChart(): void {
    const statusCounts = [
      this.tasks.filter(t => t.etat === TaskState.EN_ATTENTE).length,
      this.tasks.filter(t => t.etat === TaskState.EN_COURS).length,
      this.tasks.filter(t => t.etat === TaskState.VALIDEE).length,
      this.tasks.filter(t => t.etat === TaskState.NON_VALIDEE).length
    ];

    this.taskStatusChartData.datasets[0].data = statusCounts;
  }

  updateBudgetChart(): void {
    const marketsWithBudget = this.markets
      .filter(m => m.budget_estime && m.budget_estime > 0)
      .sort((a, b) => (b.budget_estime || 0) - (a.budget_estime || 0))
      .slice(0, 10); // Top 10

    this.budgetChartData.labels = marketsWithBudget.map(m => m.intitule);
    this.budgetChartData.datasets[0].data = marketsWithBudget.map(m => m.budget_estime || 0);
  }

  updateTimelineChart(): void {
    // Group by month
    const monthlyData = new Map<string, { markets: number; tasks: number }>();

    // Process markets
    this.markets.forEach(market => {
      if (market.created_at) {
        const month = new Date(market.created_at).toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!monthlyData.has(month)) {
          monthlyData.set(month, { markets: 0, tasks: 0 });
        }
        monthlyData.get(month)!.markets++;
      }
    });

    // Process tasks
    this.tasks.forEach(task => {
      if (task.created_at) {
        const month = new Date(task.created_at).toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!monthlyData.has(month)) {
          monthlyData.set(month, { markets: 0, tasks: 0 });
        }
        monthlyData.get(month)!.tasks++;
      }
    });

    // Sort by date
    const sortedMonths = Array.from(monthlyData.keys()).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    this.timelineChartData.labels = sortedMonths;
    this.timelineChartData.datasets[0].data = sortedMonths.map(m => monthlyData.get(m)!.markets);
    this.timelineChartData.datasets[1].data = sortedMonths.map(m => monthlyData.get(m)!.tasks);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(value);
  }
}