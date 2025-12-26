import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UsuarioService } from '../../services/data/usuario/usuario-service';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { AlertService } from '../../services/alert/alert';
import { Form } from '../../components/form/form';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-usuario',
  imports: [CommonModule, Navbar, Form, FormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {
  users: User[] = [];

  // Parámetros de paginación y búsqueda
  paginaActual: number = 1;
  cantidad: number = 10;
  totalRegistros: number = 0;
  totalPaginas: number = 0;
  Math = Math;
  // Parámetros de ordenamiento
  campoOrden: string = '';
  direccionOrden: string = 'ASC';

  // Búsqueda
  terminoBusqueda: string = '';

  // ... resto de tus propiedades

  private usuarioService = inject(UsuarioService);
  private alertService = inject(AlertService);
  role: string = '';
  ngOnInit(): void {
    this.cargarUsuarios();
    this.role = localStorage.getItem('role') || '';
  }

  private router = inject(Router);

  viewUser(user: User): void {
    // Implementa tu lógica aquí
    this.router.navigate([`usuario/details/${user.idUser}`]);
  }

  usuarioASeleccionado: User | null = null;

  editUser(user: User): void {
    this.modalUserCustomFormOpen = true;
    this.usuarioASeleccionado = user;
    console.log('Editar usuario:', user);
    // Implementa tu lógica aquí
  }
  cargarUsuarios(): void {
    this.usuarioService
      .getUsers(
        this.paginaActual,
        this.cantidad,
        this.campoOrden,
        this.direccionOrden,
        this.terminoBusqueda
      )
      .subscribe({
        next: (response) => {
          this.users = response.object.data;
          this.totalRegistros = response.object.total;
          this.paginaActual = response.object.pagina;
          this.totalPaginas = response.object.totalPaginas;
        },
        error: (err) => {
          console.log('error al cargar los usuarios', err);
        },
      });
  }

  // Método para cambiar de página
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarUsuarios();
    }
  }

  // Método para cambiar cantidad de registros por página
  cambiarCantidad(nuevaCantidad: number): void {
    this.cantidad = nuevaCantidad;
    this.paginaActual = 1; // Resetear a la primera página
    this.cargarUsuarios();
  }

  // Método para ordenar por columna
  ordenarPor(campo: string): void {
    if (this.campoOrden === campo) {
      // Si ya está ordenado por este campo, cambiar dirección
      this.direccionOrden = this.direccionOrden === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.campoOrden = campo;
      this.direccionOrden = 'ASC';
    }
    this.paginaActual = 1; // Resetear a la primera página
    this.cargarUsuarios();
  }

  // Método para buscar
  buscar(termino: string): void {
    this.terminoBusqueda = termino;
    this.paginaActual = 1; // Resetear a la primera página
    this.cargarUsuarios();
  }

  // Método para limpiar búsqueda
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.paginaActual = 1;
    this.cargarUsuarios();
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
  modalUserCustomFormOpen = false;
  openModal() {
    this.isModalOpen = true;
  }
  openFormModal() {
    this.modalFormOpen = true;
  }
  closeModal() {
    this.modalFormOpen = false;
    this.isModalOpen = false;
    this.openDisableModal = false;
    this.modalUserCustomFormOpen = false;
    this.usuarioASeleccionado = null;
  }
  openDisableModal = false;
  confirmDisable(user: User) {
    this.openDisableModal = true;
    this.usuarioASeleccionado = user;
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
    this.closeModal();
  }
  // Cierra el modal si se hace clic fuera de él
  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
