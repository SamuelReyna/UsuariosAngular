import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { result } from '../usuario/usuario-service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth';

export interface Pais {
  idPais: number;
  nombre: string;
}
@Injectable({
  providedIn: 'root',
})
export class PaisService {
  private apiUrl = 'http://localhost:8080/api/pais';
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
