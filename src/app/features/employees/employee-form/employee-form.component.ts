import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Employee } from '../../../core/models/employee.model';
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

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private serviceService: ServiceService,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee?: Employee }
  ) {
    this.isEditMode = !!data?.employee;
    
    this.employeeForm = this.fb.group({
      nom: [data?.employee?.nom || '', [Validators.required, Validators.minLength(2)]],
      prenom: [data?.employee?.prenom || '', [Validators.required, Validators.minLength(2)]],
      email: [data?.employee?.email || '', [Validators.email]],
      telephone: [data?.employee?.telephone || ''],
      poste: [data?.employee?.poste || ''],
      id_service: [data?.employee?.id_service || null]
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
      
      if (this.isEditMode && this.data.employee?.id_employe) {
        // Update existing employee
        this.employeeService.updateEmployee(this.data.employee.id_employe, formValue).subscribe({
          next: (response) => {
            this.dialogRef.close({ ...formValue, id_employe: this.data.employee!.id_employe });
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.isSaving = false;
          }
        });
      } else {
        // Create new employee
        this.employeeService.createEmployee(formValue).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error creating employee:', error);
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