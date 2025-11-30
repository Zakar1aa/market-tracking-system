import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task } from '../../../core/models/task.model';
import { Market } from '../../../core/models/market.model';
import { Employee } from '../../../core/models/employee.model';
import { MarketService } from '../../../core/services/market.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { TaskService } from '../../../core/services/task.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;
  isLoading = true;
  isSaving = false;
  
  states = ['En attente', 'En cours', 'Validée', 'Non validée'];
  priorities = ['Urgent', 'Quotidien', 'Informatif'];
  relevances = ['Pertinente', 'Non pertinente', 'À revoir'];
  
  markets: Market[] = [];
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private marketService: MarketService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task }
  ) {
    this.isEditMode = !!data?.task;
    
    const responsableId = typeof data?.task?.responsable === 'number' 
      ? data?.task?.responsable 
      : data?.task?.responsable?.id_employe || null;
    
    this.taskForm = this.fb.group({
      titre: [data?.task?.titre || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.task?.description || ''],
      id_marche: [data?.task?.id_marche || null, Validators.required],
      etat: [data?.task?.etat || 'En attente', Validators.required],
      priorite: [data?.task?.priorite || 'Quotidien', Validators.required],
      date_debut: [data?.task?.date_debut || '', Validators.required],
      date_fin: [data?.task?.date_fin || '', Validators.required],
      duree_estimee: [data?.task?.duree_estimee || null],
      responsable: [responsableId, Validators.required],
      critique: [data?.task?.critique || false],
      pertinence: [data?.task?.pertinence || 'Pertinente']
    });
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  loadFormData(): void {
    forkJoin({
      markets: this.marketService.getAllMarkets(),
      employees: this.employeeService.getAllEmployees()
    }).subscribe({
      next: (data) => {
        this.markets = data.markets;
        this.employees = data.employees;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        this.snackBar.open('Erreur lors du chargement des données', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid && !this.isSaving) {
      this.isSaving = true;
      const formValue = this.taskForm.value;
      
      if (this.isEditMode && this.data.task?.id_tache) {
        this.taskService.updateTask(this.data.task.id_tache, formValue).subscribe({
          next: (response) => {
            this.snackBar.open('Tâche mise à jour avec succès', 'Fermer', {
              duration: 3000
            });
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', {
              duration: 3000
            });
            this.isSaving = false;
          }
        });
      } else {
        this.taskService.createTask(formValue).subscribe({
          next: (response) => {
            this.snackBar.open('Tâche créée avec succès', 'Fermer', {
              duration: 3000
            });
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error creating task:', error);
            this.snackBar.open('Erreur lors de la création', 'Fermer', {
              duration: 3000
            });
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