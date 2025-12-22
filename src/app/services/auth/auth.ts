import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from '../storage';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  errorMessage: string;
  id: number;
  img: string;
}
interface TokenDecode {
  sub: string;
  role: string;
  jti: string;
  iat: number;
  exp: number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private storage = inject(StorageService);
  private http = inject(HttpClient);

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            const token: string = response.token;
            this.storage.setItem('jwt-token', token);
            this.storage.setItem('id', response.id.toString());
            this.storage.setItem('img', response.img);
            this.decode().subscribe({
              next: (decoded) => {
                console.log('decoded:', decoded);
                // Los valores ya están en storage gracias al tap()
                const user = this.storage.getItem('user') || '';
                const role = this.storage.getItem('role') || '';

                console.log('user: ', user);
                console.log('role: ', role);
              },
              error: (error) => {
                console.error('Error al decodificar:', error);
              },
            });
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Ocurrió un error desconocido';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage =
              error.error?.errorMessage ||
              error.error?.message ||
              `Error ${error.status}: ${error.message}`;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  decode(): Observable<TokenDecode> {
    return this.http
      .get<TokenDecode>(`${this.apiUrl}/decode`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      })
      .pipe(
        tap((response) => {
          this.storage.setItem('user', response.sub);
          this.storage.setItem('role', response.role);
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Ocurrió un error desconocido';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage =
              error.error?.errorMessage ||
              error.error?.message ||
              `Error ${error.status}: ${error.message}`;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }
  private router = inject(Router);
  logout(): void {
    this.router.navigate(['login']);
    this.storage.removeItem('user');
    this.storage.removeItem('role');
    this.storage.removeItem('jwt-token');
  }
  getToken(): string | null {
    return this.storage.getItem('jwt-token');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken(); // Devuelve true si el token existe
  }

  isExpired(): Observable<boolean> {
    const token = this.storage.getItem('jwt-token');

    if (!token) {
      return of(true);
    }
    //validar si el token es valido y no ha expirado.
    return this.decode().pipe(
      map((response) => {
        const now = Math.floor(Date.now() / 1000);
        return response.exp > now;
      }),
      catchError(() => of(true))
    );
  }
}
