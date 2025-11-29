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
import { Market } from '../../../core/models/market.model';
import { MarketFormComponent } from '../market-form/market-form.component';

@Component({
  selector: 'app-market-list',
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
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.scss']
})
export class MarketListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'status', 'createdAt', 'actions'];
  
  markets: Market[] = [
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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Mock data is already loaded above
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(MarketFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.markets = [...this.markets, result as Market];
        console.log('Market created:', result);
      }
    });
  }

  openEditDialog(market: Market): void {
    const dialogRef = this.dialog.open(MarketFormComponent, {
      width: '600px',
      data: { market }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.markets.findIndex(m => m.id === result.id);
        if (index !== -1) {
          this.markets[index] = result;
          this.markets = [...this.markets]; // Trigger change detection
        }
        console.log('Market updated:', result);
      }
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    const colors: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'ACTIVE': 'primary',
      'PENDING': 'accent',
      'INACTIVE': 'warn'
    };
    return colors[status] || 'primary';
  }

  deleteMarket(id: number): void {
    if (confirm('Are you sure you want to delete this market?')) {
      this.markets = this.markets.filter(m => m.id !== id);
      console.log('Market deleted:', id);
    }
  }
}