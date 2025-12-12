import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {  result } from '../usuario/usuario-service';
import { AuthService } from '../../auth/auth';
import { Observable } from 'rxjs';
import { Municipio } from '../municipio/municipio-service';

export interface Colonia {
  idColonia: number;
  nombre: string;
  codigoPostal: string;
  municipio: Municipio;
}

@Injectable({
  providedIn: 'root',
})
export class ColoniaService {
  private apiUrl = 'http://localhost:8080/api/colonia';
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  getAll(): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  getByMunicipio(id: number): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}/byMunicipio/${id}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
}
