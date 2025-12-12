import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UsuarioService } from '../../services/data/usuario/usuario-service';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
@Component({
  selector: 'app-usuario',
  imports: [CommonModule, Navbar],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {
  users: User[] = [];
  private usuarioService = inject(UsuarioService);

  ngOnInit(): void {
    this.usuarioService.getUsers().subscribe({
      next: (response) => {
        this.users = response.object;
      },
      error: (err) => {
        console.log('error al cargar los usuarios', err);
      },
    });
  }

  // constructor(private router: Router) {}

  private router = inject(Router);

  viewUser(user: User): void {
    // Implementa tu lógica aquí
    this.router.navigate([`usuario/details/${user.idUser}`]);
  }

  editUser(user: User): void {
    console.log('Editar usuario:', user);
    // Implementa tu lógica aquí
  }

  deleteUser(user: User): void {
    console.log('Eliminar usuario:', user);
    // Implementa tu lógica aquí
  }
}
