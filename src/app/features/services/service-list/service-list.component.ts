import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Service } from '../../../core/models/service.model';
import { ServiceService } from '../../../core/services/service.service';
import { ServiceFormComponent } from '../service-form/service-form.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'description', 'created_at', 'actions'];
  services: Service[] = [];
  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private serviceService: ServiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.snackBar.open('Erreur lors du chargement des services', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
        this.snackBar.open('Service créé avec succès', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  openEditDialog(service: Service): void {
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '600px',
      data: { service }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
        this.snackBar.open('Service mis à jour avec succès', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  deleteService(service: Service): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le service "${service.nom}" ?`)) {
      this.serviceService.deleteService(service.id_service!).subscribe({
        next: () => {
          this.loadServices();
          this.snackBar.open('Service supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
}