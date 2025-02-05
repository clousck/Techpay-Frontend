import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'https://localhost:3000/api/auth/login';
  
  private authenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated()); // Estado inicial
  authenticated$ = this.authenticatedSubject.asObservable(); // Observable para que otros componentes se suscriban

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { correo, password };

    return this.http.post<any>(this.apiURL, body, { headers }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);  // Guardar token
          this.authenticatedSubject.next(true);
        }
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return throwError(() => new Error('Error en el login'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token'); // Eliminar token al cerrar sesión
    this.authenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Obtener token
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Verificar si hay token guardado
  }
}
