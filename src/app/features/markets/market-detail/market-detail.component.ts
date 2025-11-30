import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { Market } from '../../../core/models/market.model';

@Component({
  selector: 'app-market-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule
  ],
  templateUrl: './market-detail.component.html',
  styleUrls: ['./market-detail.component.scss']
})
export class MarketDetailComponent implements OnInit {
  market: Market | null = null;
  mockMarkets: Market[] = [
    {
      id_marche: 1,
      intitule: 'Technology',
      objectif: 'Technology and software development market',
      statut: 'En Cours',
      date_debut: '2025-01-15',
      date_fin: '2025-12-31',
      id_service: 1,
      created_at: '2025-01-15T10:00:00'
    },
    {
      id_marche: 2,
      intitule: 'Healthcare',
      objectif: 'Healthcare and medical services market',
      statut: 'En Cours',
      date_debut: '2025-02-10',
      date_fin: '2025-12-31',
      id_service: 1,
      created_at: '2025-02-10T10:00:00'
    },
    {
      id_marche: 3,
      intitule: 'Finance',
      objectif: 'Financial services and banking market',
      statut: 'En Cours',
      date_debut: '2025-03-05',
      date_fin: '2025-12-31',
      id_service: 1,
      created_at: '2025-03-05T10:00:00'
    },
    {
      id_marche: 4,
      intitule: 'E-commerce',
      objectif: 'Online retail and shopping platforms',
      statut: 'En Préparation',
      date_debut: '2025-10-20',
      date_fin: '2025-12-31',
      id_service: 1,
      created_at: '2025-10-20T10:00:00'
    },
    {
      id_marche: 5,
      intitule: 'Education',
      objectif: 'Educational technology and learning platforms',
      statut: 'Terminé',
      date_debut: '2025-04-12',
      date_fin: '2025-09-30',
      id_service: 1,
      created_at: '2025-04-12T10:00:00'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.market = this.mockMarkets.find(m => m.id_marche === id) || null;
  }

  goBack(): void {
    this.router.navigate(['/markets']);
  }

  editMarket(): void {
    if (this.market) {
      this.router.navigate(['/markets/edit', this.market.id_marche]);
    }
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
}