import { inject, Injectable } from '@angular/core';
import { Colonia } from '../colonia/colonia-service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth';
import { Observable } from 'rxjs';
import { result, User } from '../usuario/usuario-service';
export interface direccion {
  idDireccion: Number;
  calle: string;
  numeroInterior: string;
  numeroExterior: string;
  Colonia: Colonia;
}
@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private apiUrl = 'http://localhost:8080/api/direccion';
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  getDireccion(id: number): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  addDirecion(Usuario: any): Observable<result> {
    return this.http.post<result>(`${this.apiUrl}`, Usuario, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  updateDireccion(Usuario: User): Observable<result> {
    return this.http.put<result>(`${this.apiUrl}/${Usuario.Direcciones[0].idDireccion}`, Usuario, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  deleteDireccion(id: Number): Observable<result> {
    return this.http.delete<result>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  update(usuario: User): Observable<result> {
    return this.http.put<result>(
      `${this.apiUrl}/${usuario.Direcciones[0].idDireccion}`,
      usuario.Direcciones[0],
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
