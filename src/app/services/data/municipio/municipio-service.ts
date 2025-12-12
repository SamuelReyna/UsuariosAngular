import { inject, Injectable } from '@angular/core';
import {  result } from '../usuario/usuario-service';
import { AuthService } from '../../auth/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Estado } from '../estado/estado-service';

export interface Municipio {
  idMunicipio: number;
  nombre: string;
  estado: Estado;
}
@Injectable({
  providedIn: 'root',
})
export class MunicipioService {
  private apiUrl = 'http://localhost:8080/api/municipio';
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  getAll(): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  getByEstado(id: number): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}/byEstado/${id}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
}
