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
  displayedColumns: string[] = ['nom', 'description', 'actions'];
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
    // 1. Vérification de sécurité : L'ID est-il valide ?
    if (!service.id_service) {
        console.error("Erreur critique : Tentative de suppression d'un service sans ID", service);
        this.snackBar.open("Impossible de supprimer : ID manquant", "Fermer");
        return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer le service "${service.nom}" ?`)) {
      console.log('Envoi requête DELETE pour ID:', service.id_service); // DEBUG

      this.serviceService.deleteService(service.id_service).subscribe({
        next: () => {
          console.log('Succès DELETE (Le serveur a répondu 200 OK)'); // DEBUG
          
          // Mise à jour visuelle immédiate
          this.services = this.services.filter(s => s.id_service !== service.id_service);
          
          this.snackBar.open('Service supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erreur API DELETE:', error); // DEBUG
          
          // Message d'erreur spécifique si c'est un problème de contrainte (souvent 409 ou 500)
          let message = 'Erreur lors de la suppression';
          if (error.status === 409 || error.status === 500) {
             message = 'Impossible de supprimer : Ce service contient probablement des employés ou des marchés.';
          }
          
          this.snackBar.open(message, 'Fermer', {
            duration: 5000
          });
          
          // On recharge la liste pour être sûr que l'affichage correspond à la base de données
          this.loadServices();
        }
      });
    }
  }
}