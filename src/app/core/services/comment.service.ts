import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/commentaires';

  constructor(private http: HttpClient) {}

  getCommentsByTask(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/tache/${taskId}`);
  }

  createComment(comment: Comment): Observable<Comment> {
    const payload = {
      id_tache: comment.id_tache,
      id_auteur: comment.id_auteur,
      contenu: comment.contenu,
      priorite: comment.priorite
    };
    return this.http.post<Comment>(this.apiUrl, payload);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}