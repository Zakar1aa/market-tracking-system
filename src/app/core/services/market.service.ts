import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Market } from '../models/market.model';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private apiUrl = `${environment.apiUrl}/markets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Market[]> {
    return this.http.get<Market[]>(this.apiUrl);
  }

  getById(id: number): Observable<Market> {
    return this.http.get<Market>(`${this.apiUrl}/${id}`);
  }

  create(market: Partial<Market>): Observable<Market> {
    return this.http.post<Market>(this.apiUrl, market);
  }

  update(id: number, market: Partial<Market>): Observable<Market> {
    return this.http.put<Market>(`${this.apiUrl}/${id}`, market);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}