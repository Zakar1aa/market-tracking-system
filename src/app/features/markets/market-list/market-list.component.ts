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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Market, MarketStatus } from '../../../core/models/market.model';
import { MarketService } from '../../../core/services/market.service';
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
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.scss']
})
export class MarketListComponent implements OnInit {
  displayedColumns: string[] = ['intitule', 'objectif', 'statut', 'created_at', 'actions'];
  markets: Market[] = [];
  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private marketService: MarketService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMarkets();
  }

  loadMarkets(): void {
    this.isLoading = true;
    this.marketService.getAllMarkets().subscribe({
      next: (markets) => {
        this.markets = markets;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading markets:', error);
        this.snackBar.open('Erreur lors du chargement des marchés', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(MarketFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMarkets(); // Reload the list
        this.snackBar.open('Marché créé avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
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
        this.loadMarkets(); // Reload the list
        this.snackBar.open('Marché mis à jour avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  deleteMarket(market: Market): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le marché "${market.intitule}" ?`)) {
      this.marketService.deleteMarket(market.id_marche!).subscribe({
        next: () => {
          this.loadMarkets(); // Reload the list
          this.snackBar.open('Marché supprimé avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error deleting market:', error);
          this.snackBar.open('Erreur lors de la suppression du marché', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getStatusColor(status: MarketStatus): string {
    const colors: Record<MarketStatus, string> = {
      [MarketStatus.EN_PREPARATION]: 'accent',
      [MarketStatus.EN_COURS]: 'primary',
      [MarketStatus.TERMINE]: 'primary',
      [MarketStatus.ANNULE]: 'warn'
    };
    return colors[status] || 'primary';
  }

  getStatusLabel(status: MarketStatus): string {
    const labels: Record<MarketStatus, string> = {
      [MarketStatus.EN_PREPARATION]: 'En Préparation',
      [MarketStatus.EN_COURS]: 'En Cours',
      [MarketStatus.TERMINE]: 'Terminé',
      [MarketStatus.ANNULE]: 'Annulé'
    };
    return labels[status] || status;
  }
}