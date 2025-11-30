import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/taches';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    const request: any = {
      id_marche: task.id_marche,
      titre: task.titre,
      description: task.description,
      date_debut: task.date_debut,
      date_fin: task.date_fin,
      duree_estimee: task.duree_estimee,
      responsable: typeof task.responsable === 'number' ? task.responsable : task.responsable?.id_employe,
      etat: task.etat,
      priorite: task.priorite,
      critique: task.critique || false,
      pertinence: task.pertinence
    };

    return this.http.post<Task>(this.apiUrl, request);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    const request: any = {
      id_marche: task.id_marche,
      titre: task.titre,
      description: task.description,
      date_debut: task.date_debut,
      date_fin: task.date_fin,
      duree_estimee: task.duree_estimee,
      responsable: typeof task.responsable === 'number' ? task.responsable : task.responsable?.id_employe,
      etat: task.etat,
      priorite: task.priorite,
      critique: task.critique,
      pertinence: task.pertinence
    };

    return this.http.put<Task>(`${this.apiUrl}/${id}`, request);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}