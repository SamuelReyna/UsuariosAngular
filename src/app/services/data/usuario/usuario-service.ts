import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth';
import { Rol } from '../rol/rol-service';
import { Colonia } from '../colonia/colonia-service';

export interface User {
  idUser: number;
  nombreUsuario: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  username: string;
  estatus: number;
  verify: number;
  email: string;
  telefono: string;
  fechaNacimiento: Date;
  img: string;
  celular: string;
  curp: string;
  sexo: string;
  password: string;
  Rol: Rol;
  Direcciones: direccion[];
}

export interface direccion {
  idDireccion: Number;
  calle: string;
  numeroInterior: string;
  numeroExterior: string;
  Colonia: Colonia;
}

export interface result {
  correct: boolean;
  object: any;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuario';
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  getUsers(): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  getUser(id: number): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  addUser(user: User): Observable<result> {
    return this.http.post<result>(`${this.apiUrl}`, user, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
        ContentType: 'application/json',
      },
    });
  }
}
