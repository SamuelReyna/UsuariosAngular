import { Component, inject, OnInit } from '@angular/core';
import { direccion, User, UsuarioService } from '../../services/data/usuario/usuario-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-details',
  imports: [CommonModule, Navbar],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  id: number | null = null;
  private activateRoute = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);

  user!: User;
  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.id = idParam ? Number(idParam) : 0;
    });
    if (this.id != null && this.id > 0) {
      this.usuarioService.getUser(this.id).subscribe({
        next: (response) => {
          this.user = response.object;
        },
      });
    }
  }
  viewDireccion(direccion: direccion): void {}
  editDireccion(direccion: direccion): void {}
  deleteDireccion(direccion: direccion): void {}
}
