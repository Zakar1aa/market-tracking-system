import { Injectable, inject } from '@angular/core'; // 👈 'inject' est maintenant importé
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User, UserRole } from '../models/user.model';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // 👈 CORRECTION: Utilisation de inject() pour toutes les dépendances
  private http = inject(HttpClient); 
  private router = inject(Router);

  constructor() { /* Le constructeur est vide car les dépendances sont injectées ci-dessus */ }

  login(username: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { username, password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response: LoginResponse) => { // 👈 Correction du type 'response' (TS18046)
        const user: User = {
          username: response.username,
          role: response.role as UserRole,
          // Supposons que l'ID employé pourrait être nécessaire ici s'il existe dans LoginResponse
          id_employe: (response as any).id_employe 
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // ADD THIS METHOD HERE 👇
  register(userData: { username: string; password: string; role: UserRole; id_employe?: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

/**
   * Effectue la déconnexion de l'utilisateur.
   * Supprime les informations de session et redirige vers la page de connexion.
   */
  logout(): void {
    // 1. Supprimer l'utilisateur et le token du local storage
    localStorage.removeItem('currentUser');
    // Ajouté un potentiel token si vous en avez un
    localStorage.removeItem('authToken'); 
    
    // 2. Mettre à jour le BehaviorSubject à null
    this.currentUserSubject.next(null);
    
    // 3. Rediriger vers la page de connexion
    this.router.navigate(['/login']); 
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}