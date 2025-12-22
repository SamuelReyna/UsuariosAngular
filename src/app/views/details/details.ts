import { Component, inject, OnInit } from '@angular/core';
import { User, UsuarioService } from '../../services/data/usuario/usuario-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { direccion, DireccionService } from '../../services/data/direccion/direccion-service';
import { AlertService } from '../../services/alert/alert';
import { Form } from '../../components/form/form';
import { FormsModule } from '@angular/forms';

interface password {
  password: string;
  confirmPassword: string;
}
@Component({
  selector: 'app-details',
  imports: [CommonModule, Navbar, Form, FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  onCancel() {
    this.closeModal();
  }
  changePassword() {
    this.usuarioService.changePassword(this.user, this.passwordData.password).subscribe({
      next: (response) => {
        this.alertService.success('Contraseña cambiada éxitosamente');
        this.closeModal();
      },
      error: (err) => {
        this.alertService.error('Error al cambiar la contraseña');
        console.log('error al cambiar la contraseña', err);
      },
    });
  }

  editandoDireccion: boolean = false;

  openEditDireccion(direccion: direccion) {
    this.editandoDireccion = true;
    this.modalFormOpen = true;
    this.direccionSeleccionada = direccion;
  }

  passwordModalOpen = false;
  openPasswordModal() {
    this.passwordModalOpen = true;
  }
  confirmarEliminacion() {
    this.direccionService.deleteDireccion(this.direccionSeleccionada?.idDireccion ?? 0).subscribe({
      next: (response) => {
        console.log('Dirección eliminada:', response);
        this.alertService.success('Dirección eliminada éxitosamente');
        this.getUser();
      },
      error: (err) => {
        this.alertService.error('Error al eliminar la dirección');
        console.log('error al eliminar la dirección', err);
      },
    });
    this.isModalOpen = false;
    this.getUser();
  }
  modalFormOpen = false;

  closeModal() {
    this.isModalOpen = false;
    this.modalFormOpen = false;
    this.passwordModalOpen = false;
  }
  openFormModal() {
    this.modalFormOpen = true;
  }
  idUsuario: number | null = null;
  private activateRoute = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);
  private direccionService = inject(DireccionService);
  private alertService = inject(AlertService);
  user!: User;
  isModalOpen = false;
  localUser = localStorage.getItem('user');

  ngOnInit(): void {
    this.getUser();
  }
  getUser(): void {
    this.activateRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.idUsuario = idParam ? Number(idParam) : 0;
    });
    if (this.idUsuario != null && this.idUsuario > 0) {
      this.usuarioService.getUser(this.idUsuario).subscribe({
        next: (response) => {
          this.user = response.object;
        },
      });
    }
  }
  passwordData: password = { password: '', confirmPassword: '' };

  direccionSeleccionada: direccion | null = null;
  viewDireccion(direccion: direccion): void {}
  deleteDireccion(direccion: direccion): void {
    this.direccionSeleccionada = direccion;
    this.isModalOpen = true;
  }
  defaultAvatar = 'https://ui-avatars.com/api/?name=' + this.user;
}
