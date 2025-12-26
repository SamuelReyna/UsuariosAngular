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
import { AlertService } from '../services/alert/alert';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Rutas completamente excluidas del interceptor
  const excludedRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/sendEmail',
    '/auth/changePassword',
    '/auth/verifyAccount',
    '/auth/sendVerifyEmail',
  ];

  const isExcluded = excludedRoutes.some((route) => req.url.includes(route));

  // Si la ruta está excluida, pasar la petición sin modificar
  if (isExcluded) {
    return next(req);
  }

  // Para el resto de rutas, aplicar la lógica normal
  const authService = inject(AuthService);
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  const alertService = inject(AlertService);

  const token = authService.getToken();

  if (token && jwtHelper.isTokenExpired(token)) {
    authService.logout();
    router.navigate(['/login']);
    alertService.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
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
        authService.logout();
        alertService.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
