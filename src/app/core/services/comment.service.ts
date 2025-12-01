import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comment } from '../models/comment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/commentaires`;

  constructor(private http: HttpClient) {}

  // Get all comments for a specific task (filter on frontend)
  getCommentsByTask(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl).pipe(
      map((comments: Comment[]) => 
        comments.filter(comment => comment.id_tache === taskId)
      )
    );
  }

  // Get all comments
  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }

  // Get comment by ID
  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }

  // Add new comment
  addComment(comment: Partial<Comment>): Observable<any> {
    const payload = {
      idTache: comment.id_tache,
      idAuteur: comment.id_auteur,
      contenu: comment.contenu,
      priorite: comment.priorite
    };
    return this.http.post(this.apiUrl, payload);
  }

  // Update comment
  updateComment(id: number, comment: Partial<Comment>): Observable<any> {
    const payload = {
      contenu: comment.contenu,
      priorite: comment.priorite
    };
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  // Delete comment
  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}