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
import { Task } from '../../../core/models/task.model';

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
    MatNativeDateModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean;
  
  statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'DONE', label: 'Done' }
  ];

  priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' }
  ];

  projectOptions = [
    { value: 1, label: 'E-commerce Platform' },
    { value: 2, label: 'Mobile App Development' },
    { value: 3, label: 'Marketing Campaign Q4' },
    { value: 4, label: 'Data Analytics Dashboard' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task }
  ) {
    this.isEditMode = !!data?.task;
    
    this.taskForm = this.fb.group({
      title: [data?.task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.task?.description || '', [Validators.required, Validators.minLength(10)]],
      projectId: [data?.task?.projectId || 1, Validators.required],
      status: [data?.task?.status || 'TODO', Validators.required],
      priority: [data?.task?.priority || 'MEDIUM', Validators.required],
      dueDate: [data?.task?.dueDate || null]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      if (this.isEditMode) {
        const updatedTask: Task = {
          ...this.data.task!,
          ...formValue
        };
        this.dialogRef.close(updatedTask);
      } else {
        const newTask: Task = {
          id: Math.floor(Math.random() * 10000),
          ...formValue,
          createdAt: new Date()
        };
        this.dialogRef.close(newTask);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}