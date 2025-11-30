import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Market, MarketStatus } from '../models/market.model';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private apiUrl = `${environment.apiUrl}/marches`;

  constructor(private http: HttpClient) {}

  getAllMarkets(): Observable<Market[]> {
    return this.http.get<Market[]>(this.apiUrl);
  }

  getMarketById(id: number): Observable<Market> {
    return this.http.get<Market>(`${this.apiUrl}/${id}`);
  }

  createMarket(market: Market): Observable<any> {
    const request = {
      intitule: market.intitule,
      objectif: market.objectif,
      budgetEstime: market.budget_estime,
      dateDebut: market.date_debut,
      dateFin: market.date_fin,
      statut: market.statut,
      idService: market.id_service,
      fichierCpsPath: market.fichier_cps_path,
      idCreatedBy: market.id_created_by
    };
    
    return this.http.post(this.apiUrl, request);
  }

  updateMarket(id: number, market: Partial<Market>): Observable<any> {
    const request: any = {};
    
    if (market.intitule) request.intitule = market.intitule;
    if (market.objectif) request.objectif = market.objectif;
    if (market.budget_estime !== undefined) request.budgetEstime = market.budget_estime;
    if (market.date_debut) request.dateDebut = market.date_debut;
    if (market.date_fin) request.dateFin = market.date_fin;
    if (market.statut) request.statut = market.statut;
    if (market.id_service) request.idService = market.id_service;
    if (market.fichier_cps_path) request.fichierCpsPath = market.fichier_cps_path;
    
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }

  deleteMarket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMarketsByStatus(status: MarketStatus): Observable<Market[]> {
    return this.http.get<Market[]>(`${this.apiUrl}/statut/${status}`);
  }

  getActiveMarkets(): Observable<Market[]> {
    return this.http.get<Market[]>(`${this.apiUrl}/actifs`);
  }

  getMarketsByService(idService: number): Observable<Market[]> {
    return this.http.get<Market[]>(`${this.apiUrl}/service/${idService}`);
  }
}
