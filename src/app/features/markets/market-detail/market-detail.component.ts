import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip'; // Ajout pour le tooltip du bouton download

// Models
import { Market, MarketStatus } from '../../../core/models/market.model';
import { Task } from '../../../core/models/task.model';
import { Approval } from '../../../core/models/approval.model';

// Services
import { MarketService } from '../../../core/services/market.service';
import { TaskService } from '../../../core/services/task.service';
import { ApprovalService } from '../../../core/services/approval.service';

// Components
import { ApprovalDialogComponent } from '../../tasks/approval-dialog/approval-dialog.component';
import { MarketFormComponent } from '../market-form/market-form.component';

@Component({
  selector: 'app-market-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './market-detail.component.html',
  styleUrls: ['./market-detail.component.scss']
})
export class MarketDetailComponent implements OnInit {
  market: Market | null = null;
  tasks: Task[] = [];
  approvals: Approval[] = [];
  
  isLoading = true;
  isLoadingTasks = false;
  isLoadingApprovals = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private marketService: MarketService,
    private taskService: TaskService,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadMarketData(id);
    }
  }

  loadMarketData(id: number): void {
    this.isLoading = true;
    
    this.marketService.getMarketById(id).subscribe({
      next: (market) => {
        this.market = market;
        this.isLoading = false;
        // Charger les données liées
        this.loadTasks(id);
        this.loadApprovals(id);
      },
      error: (error) => {
        console.error('Erreur chargement marché:', error);
        this.snackBar.open('Erreur lors du chargement du marché', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadTasks(marketId: number): void {
    this.isLoadingTasks = true;
    this.taskService.getAllTasks().subscribe({
      next: (allTasks) => {
        this.tasks = allTasks.filter(t => t.id_marche === marketId);
        this.isLoadingTasks = false;
      },
      error: (err) => {
        console.error('Erreur chargement tâches:', err);
        this.isLoadingTasks = false;
      }
    });
  }

  loadApprovals(marketId: number): void {
    this.isLoadingApprovals = true;
    this.approvalService.getApprovalsByMarket(marketId).subscribe({
      next: (approvals) => {
        this.approvals = approvals;
        this.isLoadingApprovals = false;
      },
      error: (err) => {
        console.error('Erreur chargement approbations:', err);
        this.isLoadingApprovals = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/markets']);
  }

  editMarket(): void {
    if (!this.market) return;

    const dialogRef = this.dialog.open(MarketFormComponent, {
      width: '600px',
      data: { market: this.market }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMarketData(this.market!.id_marche!);
        this.snackBar.open('Marché mis à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  openApprovalDialog(): void {
    if (!this.market || !this.market.id_marche) return;

    const dialogRef = this.dialog.open(ApprovalDialogComponent, {
      width: '600px',
      data: { 
        marketId: this.market.id_marche,
        marketTitle: this.market.intitule
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        const message = result.statut === 'Approuvé' 
          ? 'Marché approuvé avec succès' 
          : 'Marché refusé';
        this.snackBar.open(message, 'Fermer', { duration: 3000 });
        
        // Recharger les données pour voir le nouveau statut
        this.loadMarketData(this.market!.id_marche!);
      }
    });
  }

  downloadDocument(filePath: string): void {
    console.log('Téléchargement du fichier:', filePath);
    if (filePath && filePath !== 'default.pdf') {
       // Logique de téléchargement réelle ici
       alert(`Simulation du téléchargement pour : ${filePath}`);
    } else {
       this.snackBar.open('Aucun fichier physique associé', 'Fermer', { duration: 3000 });
    }
  }

  // 💡 MODIFICATION ICI : Visible uniquement si EN_PREPARATION
  canApprove(): boolean {
    return this.market?.statut === MarketStatus.EN_PREPARATION;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case MarketStatus.EN_COURS: return 'primary';
      case MarketStatus.TERMINE: return 'accent';
      case MarketStatus.EN_PREPARATION: return 'warn';
      case MarketStatus.ANNULE: return 'warn';
      default: return 'primary';
    }
  }
}