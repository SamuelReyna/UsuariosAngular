import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UsuarioService } from '../../services/data/usuario/usuario-service';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { AlertService } from '../../services/alert/alert';
import { Form } from '../../components/form/form';
@Component({
  selector: 'app-usuario',
  imports: [CommonModule, Navbar, Form],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {
  users: User[] = [];
  private usuarioService = inject(UsuarioService);
  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // constructor(private router: Router) {}

  private router = inject(Router);

  viewUser(user: User): void {
    // Implementa tu lógica aquí
    this.router.navigate([`usuario/details/${user.idUser}`]);
  }

  usuarioASeleccionado: User | null = null;

  editUser(user: User): void {
    console.log('Editar usuario:', user);
    // Implementa tu lógica aquí
  }
  cargarUsuarios(): void {
    this.usuarioService.getUsers().subscribe({
      next: (response) => {
        this.users = response.object;
      },
      error: (err) => {
        console.log('error al cargar los usuarios', err);
      },
    });
  }
  deleteUser(user: User): void {
    this.openModal();
    this.usuarioASeleccionado = user;
  }
  confirmarEliminacion(): void {
    if (this.usuarioASeleccionado) {
      this.usuarioService.deleteUser(this.usuarioASeleccionado).subscribe({
        next: (response) => {
          console.log('Usuario eliminado:', response);
          // Actualizar la lista de usuarios
          this.cargarUsuarios(); // o this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioAEliminar!.id);
          this.closeModal();
          this.alertService.success('Usuario eliminado éxitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.alertService.error(`Error al eliminar el usuario: ${error}`);
          // Mostrar mensaje de error
        },
      });
    }
  }
  isModalOpen = false;
  modalFormOpen = false;

  openModal() {
    this.isModalOpen = true;
  }
  openFormModal() {
    this.modalFormOpen = true;
  }

  closeModal() {
    this.modalFormOpen = false;
    this.isModalOpen = false;
  }

  onDisabled(user: User) {
    this.usuarioService.logicalDelete(user).subscribe({
      next: () => {
        // Cambiar el estatus localmente sin recargar toda la lista
        user.estatus = user.estatus === 1 ? 0 : 1;

        const mensaje =
          user.estatus === 1 ? 'Usuario activado éxitosamente' : 'Usuario desactivado éxitosamente';

        this.alertService.success(mensaje);
      },
      error: (error) => {
        console.log('error ', error);
        this.alertService.error(
          `Error al modificar el estatus del usuario: ${error.message || error}`
        );
      },
    });
  }

  // Cierra el modal si se hace clic fuera de él
  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
