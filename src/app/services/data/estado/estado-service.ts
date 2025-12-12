import { inject, Injectable } from '@angular/core';
import { result } from '../usuario/usuario-service';
import { AuthService } from '../../auth/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pais } from '../pais/pais-service';

export interface Estado {
  idEstado: number;
  nombre: string;
  pais: Pais;
}
@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  private apiUrl = 'http://localhost:8080/api/estado';
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  getAll(): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  getByIdPais(id: number): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}/byPais/${id}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
}
