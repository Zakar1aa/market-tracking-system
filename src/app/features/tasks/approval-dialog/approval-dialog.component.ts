import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ApprovalService } from '../../../core/services/approval.service';
import { AuthService } from '../../../core/services/auth.service';

interface DialogData {
  marketId?: number;
  marketTitle?: string;
  taskId?: number;
  taskTitle?: string;
}

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
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.scss']
})
export class ApprovalDialogComponent implements OnInit {
  approvalForm!: FormGroup;
  isSubmitting = false;
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private approvalService: ApprovalService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get current user ID from auth service
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id_employe || null;

    if (!this.currentUserId) {
      console.warn('No current user ID found');
    }

    this.approvalForm = this.fb.group({
      decision: ['Approuvé', Validators.required],
      motif: ['']
    });

    // Make motif required if rejecting
    this.approvalForm.get('decision')?.valueChanges.subscribe(decision => {
      const motifControl = this.approvalForm.get('motif');
      if (decision === 'Refusé') {
        motifControl?.setValidators([Validators.required, Validators.maxLength(1000)]);
      } else {
        motifControl?.setValidators([Validators.maxLength(1000)]);
      }
      motifControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.approvalForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', {
        duration: 3000
      });
      return;
    }

    if (!this.currentUserId) {
      this.snackBar.open('Impossible d\'identifier l\'utilisateur actuel', 'Fermer', {
        duration: 3000
      });
      return;
    }

    if (!this.data.marketId) {
      this.snackBar.open('ID du marché manquant', 'Fermer', {
        duration: 3000
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.approvalForm.value;

    const approval = {
      id_marche: this.data.marketId,
      id_employe: this.currentUserId,
      statut: formValue.decision,
      motif: formValue.motif || null
    };

    this.approvalService.createApproval(approval).subscribe({
      next: (response: any) => {
        this.snackBar.open(
          formValue.decision === 'Approuvé' 
            ? 'Marché approuvé avec succès' 
            : 'Marché refusé',
          'Fermer',
          { duration: 3000 }
        );
        this.dialogRef.close({ success: true, statut: formValue.decision });
      },
      error: (error: any) => {
        console.error('Error submitting approval:', error);
        const errorMessage = error.error?.message || 'Erreur lors de l\'enregistrement de la décision';
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000
        });
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Getter for displaying the title
  get displayTitle(): string {
    return this.data.marketTitle || this.data.taskTitle || 'Élément';
  }
}