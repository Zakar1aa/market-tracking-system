import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Employee, EmployeeRole } from '../../../core/models/employee.model';
import { Service } from '../../../core/models/service.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { ServiceService } from '../../../core/services/service.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode: boolean = false;
  isLoading = true;
  isSaving = false;
  
  services: Service[] = [];
  roles = Object.values(EmployeeRole); // Pour la liste déroulante

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private serviceService: ServiceService,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee?: Employee }
  ) {
    this.isEditMode = !!data?.employee;
    
    // Adaptation au Backend : Suppression de telephone/poste, Ajout de Role
    this.employeeForm = this.fb.group({
      nom: [data?.employee?.nom || '', [Validators.required, Validators.minLength(2)]],
      prenom: [data?.employee?.prenom || '', [Validators.required, Validators.minLength(2)]],
      email: [data?.employee?.email || '', [Validators.required, Validators.email]],
      role: [data?.employee?.role || 'EMPLOYE', [Validators.required]], // Valeur par défaut
      id_service: [data?.employee?.id_service || null, [Validators.required]] // Requis par le backend
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid && !this.isSaving) {
      this.isSaving = true;
      const formValue = this.employeeForm.value;

      // 💡 TRANSFORMATION CRUCIALE POUR LE BACKEND
      // Le backend attend "idService" et non "id_service"
      const payload: any = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        email: formValue.email,
        role: formValue.role,
        idService: formValue.id_service, // Mapping id_service -> idService
        actif: true // Valeur par défaut
      };
      
      console.log('Envoi au backend:', payload); // Pour debug

      if (this.isEditMode && this.data.employee?.id_employe) {
        this.employeeService.updateEmployee(this.data.employee.id_employe, payload).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.isSaving = false;
          }
        });
      } else {
        this.employeeService.createEmployee(payload).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error creating employee:', error);
            alert("Erreur lors de la création : " + (error.error?.message || error.message));
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