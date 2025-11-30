import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Approval, ApprovalStatus } from '../models/approval.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private apiUrl = `${environment.apiUrl}/approbations`;

  constructor(private http: HttpClient) {}

  getAllApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(this.apiUrl);
  }

  getApprovalById(id: number): Observable<Approval> {
    return this.http.get<Approval>(`${this.apiUrl}/${id}`);
  }

  getApprovalsByTask(idTache: number): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}/tache/${idTache}`);
  }

  getApprovalsByEmployee(idEmploye: number): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}/employe/${idEmploye}`);
  }

  createApproval(approval: Approval): Observable<Approval> {
    // Transform to backend format (camelCase)
    const request = {
      idTache: approval.id_tache,
      idEmploye: approval.id_employe,
      statut: approval.statut,
      commentaire: approval.commentaire,
      dateApprobation: approval.date_approbation
    };
    return this.http.post<Approval>(this.apiUrl, request);
  }

  updateApproval(id: number, approval: Partial<Approval>): Observable<Approval> {
    const request: any = {};
    if (approval.id_tache) request.idTache = approval.id_tache;
    if (approval.id_employe) request.idEmploye = approval.id_employe;
    if (approval.statut) request.statut = approval.statut;
    if (approval.commentaire !== undefined) request.commentaire = approval.commentaire;
    if (approval.date_approbation) request.dateApprobation = approval.date_approbation;
    
    return this.http.put<Approval>(`${this.apiUrl}/${id}`, request);
  }

  deleteApproval(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approveTask(idTache: number, idEmploye: number, commentaire?: string): Observable<Approval> {
    const request = {
      idTache: idTache,
      idEmploye: idEmploye,
      statut: 'APPROUVE',  // Send enum value as string
      commentaire: commentaire || null,
      dateApprobation: new Date().toISOString()
    };
    return this.http.post<Approval>(this.apiUrl, request);
  }

  rejectTask(idTache: number, idEmploye: number, commentaire: string): Observable<Approval> {
    const request = {
      idTache: idTache,
      idEmploye: idEmploye,
      statut: 'REJETE',  // Send enum value as string
      commentaire: commentaire,
      dateApprobation: new Date().toISOString()
    };
    return this.http.post<Approval>(this.apiUrl, request);
  }
}