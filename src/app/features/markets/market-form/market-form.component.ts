import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Market, MarketStatus } from '../../../core/models/market.model';
import { Service } from '../../../core/models/service.model';
import { Employee } from '../../../core/models/employee.model';
import { ServiceService } from '../../../core/services/service.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { MarketService } from '../../../core/services/market.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-market-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './market-form.component.html',
  styleUrls: ['./market-form.component.scss']
})
export class MarketFormComponent implements OnInit {
  marketForm: FormGroup;
  isEditMode: boolean = false;
  isLoading = true;
  isSaving = false;
  
  statuses = Object.values(MarketStatus);
  services: Service[] = [];
  employees: Employee[] = [];
  
  selectedFile: File | null = null;
  selectedFileName: string = '';
  existingFilePath: string = '';

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private employeeService: EmployeeService,
    private marketService: MarketService,
    public dialogRef: MatDialogRef<MarketFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { market?: Market }
  ) {
    this.isEditMode = !!data?.market;
    this.existingFilePath = data?.market?.fichier_cps_path || '';
    
    // Extraction sécurisée des IDs pour le mode édition (car le backend renvoie des objets imbriqués)
    const serviceId = data?.market?.service?.id_service || null;
    // Si created_by est un objet, on prend son ID, sinon null
    const creatorId = data?.market?.created_by?.id_employe || null;

    this.marketForm = this.fb.group({
      intitule: [data?.market?.intitule || '', [Validators.required, Validators.minLength(3)]],
      objectif: [data?.market?.objectif || '', [Validators.required]],
      statut: [data?.market?.statut || MarketStatus.EN_PREPARATION, Validators.required],
      date_debut: [data?.market?.date_debut || '', Validators.required],
      date_fin: [data?.market?.date_fin || '', Validators.required],
      budget_estime: [data?.market?.budget_estime || null],
      id_service: [serviceId, Validators.required], // ID du service
      id_created_by: [creatorId],                   // ID du créateur
      fichier_cps_path: [data?.market?.fichier_cps_path || '']
    });
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  loadFormData(): void {
    forkJoin({
      services: this.serviceService.getAllServices(),
      employees: this.employeeService.getAllEmployees()
    }).subscribe({
      next: (data) => {
        this.services = data.services;
        this.employees = data.employees;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF uniquement');
        event.target.value = '';
        return;
      }
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Le fichier ne doit pas dépasser 10 MB');
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.marketForm.patchValue({ fichier_cps_path: '' });
  }

  getStatusLabel(status: MarketStatus): string {
    const labels: { [key in MarketStatus]: string } = {
      [MarketStatus.EN_PREPARATION]: 'En Préparation',
      [MarketStatus.EN_COURS]: 'En Cours',
      [MarketStatus.TERMINE]: 'Terminé',
      [MarketStatus.ANNULE]: 'Annulé'
    };
    return labels[status];
  }

  onSubmit(): void {
    if (this.marketForm.valid && !this.isSaving) {
      this.isSaving = true;
      const formValue = this.marketForm.value;
      
      // Gestion du fichier (chemin simulé)
      let finalFilePath = formValue.fichier_cps_path;
      if (this.selectedFile) {
        finalFilePath = `/uploads/cps/${Date.now()}_${this.selectedFile.name}`;
      }
      
      // 💡 TRANSFORMATION CRUCIALE : Mapping des champs pour le Backend Java
      // Les clés à gauche doivent correspondre EXACTEMENT aux clés attendues par request.get("key") dans le contrôleur Java
      const payload = {
        intitule: formValue.intitule,
        objectif: formValue.objectif,
        budgetEstime: formValue.budget_estime, // Java attend: budgetEstime
        dateDebut: formValue.date_debut,       // Java attend: dateDebut
        dateFin: formValue.date_fin,           // Java attend: dateFin
        statut: formValue.statut,
        idService: formValue.id_service,       // Java attend: idService
        idCreatedBy: formValue.id_created_by,  // Java attend: idCreatedBy
        fichierCpsPath: finalFilePath || 'default.pdf' // Java attend: fichierCpsPath
      };

      console.log('Envoi au Backend:', payload); // Vérifiez la console pour voir ces clés

      if (this.isEditMode && this.data.market?.id_marche) {
        this.marketService.updateMarket(this.data.market.id_marche, payload).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error updating market:', error);
            const msg = error.error?.message || error.message;
            alert("Erreur mise à jour : " + msg);
            this.isSaving = false;
          }
        });
      } else {
        this.marketService.createMarket(payload).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error creating market:', error);
            const msg = error.error?.message || error.message;
            alert("Erreur création : " + msg);
            this.isSaving = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}