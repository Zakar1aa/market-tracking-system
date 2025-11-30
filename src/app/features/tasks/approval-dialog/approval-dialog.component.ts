import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../core/models/task.model';
import { ApprovalStatus } from '../../../core/models/approval.model';
import { ApprovalService } from '../../../core/services/approval.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-approval-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.scss']
})
export class ApprovalDialogComponent implements OnInit {
  approvalForm: FormGroup;
  isSaving = false;
  currentUserId: number | null = null;

  ApprovalStatus = ApprovalStatus;

  constructor(
    private fb: FormBuilder,
    private approvalService: ApprovalService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.approvalForm = this.fb.group({
      decision: [ApprovalStatus.APPROUVE, Validators.required],
      commentaire: ['']
    });
  }

  ngOnInit(): void {
    // Get current user ID (you might need to adjust this based on your auth structure)
    const currentUser = this.authService.getCurrentUser();
    // For now, we'll use a placeholder - you'll need to get actual employee ID
    this.currentUserId = 1; // TODO: Get from current user's employee record
  }

  onDecisionChange(): void {
    const decision = this.approvalForm.get('decision')?.value;
    const commentaireControl = this.approvalForm.get('commentaire');

    if (decision === ApprovalStatus.REJETE) {
      commentaireControl?.setValidators([Validators.required]);
    } else {
      commentaireControl?.clearValidators();
    }
    commentaireControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.approvalForm.valid && !this.isSaving && this.currentUserId) {
      this.isSaving = true;
      const formValue = this.approvalForm.value;

      const approvalAction = formValue.decision === ApprovalStatus.APPROUVE
        ? this.approvalService.approveTask(
            this.data.task.id_tache!,
            this.currentUserId,
            formValue.commentaire
          )
        : this.approvalService.rejectTask(
            this.data.task.id_tache!,
            this.currentUserId,
            formValue.commentaire
          );

      approvalAction.subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error submitting approval:', error);
          this.isSaving = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}