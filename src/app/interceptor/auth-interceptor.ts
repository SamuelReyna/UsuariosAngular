import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  const token = authService.getToken();
  if (token && jwtHelper.isTokenExpired(token)) {
    // Si el token ha expirado localmente, cerrar sesión y redirigir inmediatamente
    authService.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('Token expirado localmente'));
  }
  let request = req;
  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // En caso de error 401/403 (no autorizado, usualmente por token expirado en backend)
        authService.logout(); // Eliminar tokens
        router.navigate(['/login']); // Redirigir a la página de login
      }
      return throwError(() => error);
    })
  );
};
