import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment, CommentType } from '../../../core/models/comment.model';
import { CommentService } from '../../../core/services/comment.service';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent implements OnInit {
  comments: Comment[] = [];
  commentForm: FormGroup;
  commentTypes = Object.values(CommentType);
  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { taskId: number; taskTitle: string },
    private dialogRef: MatDialogRef<CommentDialogComponent>,
    private fb: FormBuilder,
    private commentService: CommentService,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      contenu: ['', [Validators.required, Validators.minLength(3)]],
      type: [CommentType.INFORMATIF, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.commentService.getCommentsByTask(this.data.taskId).subscribe({
      next: (comments) => {
        this.comments = comments.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoading = false;
        // Use mock data if backend fails
        this.useMockComments();
      }
    });
  }

  useMockComments(): void {
    this.comments = [
      {
        id_commentaire: 1,
        id_tache: this.data.taskId,
        id_auteur: 1,
        contenu: 'Ce marché nécessite une attention urgente.',
        priorite: CommentType.URGENT,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        auteur: { nom: 'Dupont', prenom: 'Jean' }
      },
      {
        id_commentaire: 2,
        id_tache: this.data.taskId,
        id_auteur: 2,
        contenu: 'Progression normale, tout est conforme.',
        priorite: CommentType.QUOTIDIEN,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        auteur: { nom: 'Martin', prenom: 'Marie' }
      }
    ];
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        id_tache: this.data.taskId,
        id_auteur: this.getCurrentUserId(),
        contenu: this.commentForm.value.contenu!,
        priorite: this.commentForm.value.type!
      };

      this.commentService.addComment(newComment).subscribe({
        next: (comment) => {
          this.comments.unshift(comment);
          this.commentForm.reset({ type: CommentType.INFORMATIF });
          this.snackBar.open('Commentaire ajouté avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          // Mock fallback
          const mockComment: Comment = {
            id_commentaire: Date.now(),
            ...newComment,
            created_at: new Date().toISOString(),
            auteur: { nom: 'Vous', prenom: '' }
          };
          this.comments.unshift(mockComment);
          this.commentForm.reset({ type: CommentType.INFORMATIF });
          this.snackBar.open('Commentaire ajouté (mode démo)', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  deleteComment(commentId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id_commentaire !== commentId);
          this.snackBar.open('Commentaire supprimé', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          // Mock fallback
          this.comments = this.comments.filter(c => c.id_commentaire !== commentId);
          this.snackBar.open('Commentaire supprimé (mode démo)', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  getCurrentUserId(): number {
    // TODO: Get from auth service
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || 1;
    }
    return 1;
  }

  getTypeColor(type: CommentType): string {
    switch (type) {
      case CommentType.URGENT:
        return 'warn';
      case CommentType.QUOTIDIEN:
        return 'accent';
      case CommentType.INFORMATIF:
        return 'primary';
      default:
        return 'primary';
    }
  }

  getTypeIcon(type: CommentType): string {
    switch (type) {
      case CommentType.URGENT:
        return 'warning';
      case CommentType.QUOTIDIEN:
        return 'event';
      case CommentType.INFORMATIF:
        return 'info';
      default:
        return 'info';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}