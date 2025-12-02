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

  // MODIFICATION: Accepte 'any' pour envoyer le payload tel quel
  createMarket(marketPayload: any): Observable<any> {
    return this.http.post(this.apiUrl, marketPayload);
  }

  // MODIFICATION: Accepte 'any'
  updateMarket(id: number, marketPayload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, marketPayload);
  }

  deleteMarket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMarketsByStatus(status: MarketStatus): Observable<Market[]> {
    return this.http.get<Market[]>(`${this.apiUrl}/statut/${status}`);
  }
}