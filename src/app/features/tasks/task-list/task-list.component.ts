import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ApprovalDialogComponent } from '../approval-dialog/approval-dialog.component';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['titre', 'etat', 'priorite', 'date_fin', 'actions'];
  tasks: Task[] = [];
  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.snackBar.open('Erreur lors du chargement des tâches', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openCommentsDialog(task: Task): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { 
        taskId: task.id_tache,
        taskTitle: task.titre
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Comments are handled within the dialog
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openApprovalDialog(task: Task): void {
    const dialogRef = this.dialog.open(ApprovalDialogComponent, {
      width: '600px',
      data: { 
        taskId: task.id_tache,
        taskTitle: task.titre
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
        const message = result.statut === 'Approuvé' 
          ? 'Tâche approuvée avec succès' 
          : 'Tâche rejetée';
        this.snackBar.open(message, 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.titre}" ?`)) {
      this.taskService.deleteTask(task.id_tache!).subscribe({
        next: () => {
          this.loadTasks();
          this.snackBar.open('Tâche supprimée avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.snackBar.open('Erreur lors de la suppression de la tâche', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  getStateColor(state: string): string {
    switch (state) {
      case 'En attente': return 'warn';
      case 'En cours': return 'primary';
      case 'Validée': return 'primary';
      case 'Non validée': return 'warn';
      default: return 'primary';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Urgent': return 'warn';
      case 'Quotidien': return 'accent';
      case 'Informatif': return 'primary';
      default: return 'primary';
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.date_fin || task.etat === 'Validée') return false;
    const today = new Date();
    const dueDate = new Date(task.date_fin);
    return dueDate < today;
  }

  canApprove(task: Task): boolean {
    return task.etat === 'En cours';
  }
}