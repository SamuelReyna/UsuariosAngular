import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth';
import { Observable } from 'rxjs';
import { result } from '../usuario/usuario-service';

export interface Rol {
  idRol: number;
  nombre: string;
}
@Injectable({
  providedIn: 'root',
})
export class RolService {
  private apiUrl = 'http://localhost:8080/api/rol';
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  getAll(): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
}
