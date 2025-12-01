import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Approval } from '../models/approval.model';

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

  getApprovalsByMarket(idMarche: number): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}/marche/${idMarche}`);
  }

  getApprovalsByEmployee(idEmploye: number): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}/employe/${idEmploye}`);
  }

  getApprovalsByStatus(statut: string): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}/statut/${statut}`);
  }

  getApprovedApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}/approuvees`);
  }

  getRejectedApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}/refusees`);
  }

  getMarketStatistics(idMarche: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marche/${idMarche}/statistiques`);
  }

  checkApprovalExists(idMarche: number, idEmploye: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/marche/${idMarche}/employe/${idEmploye}/existe`);
  }

  createApproval(approval: Approval): Observable<any> {
    // Backend expects: idMarche, idEmploye, statut, motif (optional)
    const payload = {
      idMarche: approval.id_marche,
      idEmploye: approval.id_employe,
      statut: approval.statut,
      motif: approval.motif || null
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  updateApproval(id: number, approval: Partial<Approval>): Observable<any> {
    const payload: any = {};
    if (approval.statut) payload.statut = approval.statut;
    if (approval.motif !== undefined) payload.motif = approval.motif;
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteApproval(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Helper method: Approve a market
  approveMarket(idMarche: number, idEmploye: number, motif?: string): Observable<any> {
    return this.createApproval({
      id_marche: idMarche,
      id_employe: idEmploye,
      statut: 'Approuvé',  // Backend normalizes this
      motif: motif
    });
  }

  // Helper method: Reject a market
  rejectMarket(idMarche: number, idEmploye: number, motif: string): Observable<any> {
    return this.createApproval({
      id_marche: idMarche,
      id_employe: idEmploye,
      statut: 'Refusé',  // Backend normalizes this
      motif: motif
    });
  }
}