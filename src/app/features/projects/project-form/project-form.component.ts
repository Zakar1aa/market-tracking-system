import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-form',
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
    MatSliderModule
  ],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode: boolean;
  
  statusOptions = [
    { value: 'PLANNING', label: 'Planning' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ON_HOLD', label: 'On Hold' }
  ];

  marketOptions = [
    { value: 1, label: 'Technology' },
    { value: 2, label: 'Healthcare' },
    { value: 3, label: 'Finance' },
    { value: 4, label: 'E-commerce' },
    { value: 5, label: 'Education' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project?: Project }
  ) {
    this.isEditMode = !!data?.project;
    
    this.projectForm = this.fb.group({
      name: [data?.project?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.project?.description || '', [Validators.required, Validators.minLength(10)]],
      marketId: [data?.project?.marketId || 1, Validators.required],
      status: [data?.project?.status || 'PLANNING', Validators.required],
      startDate: [data?.project?.startDate || new Date(), Validators.required],
      endDate: [data?.project?.endDate || null],
      progress: [data?.project?.progress || 0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      
      if (this.isEditMode) {
        const updatedProject: Project = {
          ...this.data.project!,
          ...formValue
        };
        this.dialogRef.close(updatedProject);
      } else {
        const newProject: Project = {
          id: Math.floor(Math.random() * 10000),
          ...formValue
        };
        this.dialogRef.close(newProject);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }
}