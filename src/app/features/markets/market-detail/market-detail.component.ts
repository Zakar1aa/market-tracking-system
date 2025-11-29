import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Market } from '../../../core/models/market.model';

@Component({
  selector: 'app-market-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './market-detail.component.html',
  styleUrls: ['./market-detail.component.scss']
})
export class MarketDetailComponent implements OnInit {
  market: Market | null = null;
  
  // Mock data - this would come from API
  mockMarkets: Market[] = [
    {
      id: 1,
      name: 'Technology',
      description: 'Technology and software development market',
      status: 'ACTIVE',
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-11-20')
    },
    {
      id: 2,
      name: 'Healthcare',
      description: 'Healthcare and medical services market',
      status: 'ACTIVE',
      createdAt: new Date('2025-02-10'),
      updatedAt: new Date('2025-11-18')
    },
    {
      id: 3,
      name: 'Finance',
      description: 'Financial services and banking market',
      status: 'ACTIVE',
      createdAt: new Date('2025-03-05'),
      updatedAt: new Date('2025-11-15')
    },
    {
      id: 4,
      name: 'E-commerce',
      description: 'Online retail and shopping platforms',
      status: 'PENDING',
      createdAt: new Date('2025-10-20'),
      updatedAt: new Date('2025-11-25')
    },
    {
      id: 5,
      name: 'Education',
      description: 'Educational technology and learning platforms',
      status: 'INACTIVE',
      createdAt: new Date('2025-04-12'),
      updatedAt: new Date('2025-09-30')
    }
  ];

  // Mock related projects
  relatedProjects = [
    { id: 1, name: 'E-commerce Platform Redesign', status: 'IN_PROGRESS', progress: 65 },
    { id: 2, name: 'Mobile App Development', status: 'IN_PROGRESS', progress: 40 },
    { id: 3, name: 'Marketing Campaign Q4', status: 'PLANNING', progress: 15 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.market = this.mockMarkets.find(m => m.id === id) || null;
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    const colors: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'ACTIVE': 'primary',
      'PENDING': 'accent',
      'INACTIVE': 'warn'
    };
    return colors[status] || 'primary';
  }

  deleteMarket(): void {
    if (confirm('Are you sure you want to delete this market?')) {
      // TODO: Call API service when backend is connected
      this.router.navigate(['/markets']);
    }
  }
}