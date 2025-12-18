import { Component, inject, OnInit } from '@angular/core';
import { User, UsuarioService } from '../../services/data/usuario/usuario-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { direccion, DireccionService } from '../../services/data/direccion/direccion-service';
import { AlertService } from '../../services/alert/alert';
import { Form } from '../../components/form/form';

@Component({
  selector: 'app-details',
  imports: [CommonModule, Navbar, Form],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
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

  direccionSeleccionada: direccion | null = null;
  viewDireccion(direccion: direccion): void {}
  editDireccion(direccion: direccion): void {}
  deleteDireccion(direccion: direccion): void {
    this.direccionSeleccionada = direccion;
    this.isModalOpen = true;
  }
}
