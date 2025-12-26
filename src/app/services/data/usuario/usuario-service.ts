import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../auth/auth';
import { Rol } from '../rol/rol-service';
import { direccion } from '../direccion/direccion-service';

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
  getUsers(
    pagina: number = 1,
    cantidad: number = 10,
    campo: string = '',
    orden: string = 'ASC',
    busqueda: string = ''
  ): Observable<result> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('cantidad', cantidad.toString())
      .set('campo', campo)
      .set('orden', orden)
      .set('busqueda', busqueda);

    return this.http.get<result>(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
      params: params,
    });
  }
  getUser(id: number): Observable<result> {
    return this.http.get<result>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  addUser(formData: FormData): Observable<result> {
    return this.http.post<result>(`${this.apiUrl}`, formData, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }
  deleteUser(user: User): Observable<result> {
    return this.http.delete<result>(`${this.apiUrl}/${user.idUser}`, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    });
  }

  logicalDelete(user: User): Observable<result> {
    return this.http.patch<result>(
      `${this.apiUrl}/estatus/${user.idUser}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          ContentType: 'application/json',
        },
      }
    );
  }
  changePassword(user: User, newPassword: string): Observable<result> {
    return this.http.put<result>(
      `${this.apiUrl}/${user.idUser}`,
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }
  update(user: any): Observable<result> {
    return this.http.put<result>(`${this.apiUrl}/${user.idUser}`, user, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
