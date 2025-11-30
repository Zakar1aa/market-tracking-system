import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Service } from '../../../core/models/service.model';
import { Employee } from '../../../core/models/employee.model';
import { ServiceService } from '../../../core/services/service.service';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-service-form',
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
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {
  serviceForm: FormGroup;
  isEditMode: boolean = false;
  isLoading = true;
  isSaving = false;
  
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<ServiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { service?: Service }
  ) {
    this.isEditMode = !!data?.service;
    
    this.serviceForm = this.fb.group({
      nom: [data?.service?.nom || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.service?.description || ''],
      chef_service: [data?.service?.chef_service || null]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.serviceForm.valid && !this.isSaving) {
      this.isSaving = true;
      const formValue = this.serviceForm.value;
      
      if (this.isEditMode && this.data.service?.id_service) {
        // Update existing service
        this.serviceService.updateService(this.data.service.id_service, formValue).subscribe({
          next: (response) => {
            this.dialogRef.close({ ...formValue, id_service: this.data.service!.id_service });
          },
          error: (error) => {
            console.error('Error updating service:', error);
            this.isSaving = false;
          }
        });
      } else {
        // Create new service
        this.serviceService.createService(formValue).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error creating service:', error);
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