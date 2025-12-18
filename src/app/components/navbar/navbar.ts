import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private storage = inject(StorageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user: string = '';
  role: string = '';
  isMenuOpen = false;
  isUserMenuOpen = false;
  userImage = ''; // opcional, reemplaza con la URL real si la tienes


  
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.user = this.storage.getItem('user') || '';
      this.role = this.storage.getItem('role') || '';
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Toggle del menú móvil
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Toggle del menú de usuario
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  // Abrir menú de usuario (hover)
  openUserMenu() {
    this.isUserMenuOpen = true;
  }

  // Cerrar menú de usuario (hover)
  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  // Navegación
  onHome() {
    this.router.navigate(['/']);
    this.closeMenus();
  }

  onUsuarios() {
    this.router.navigate(['/usuario']);
    this.closeMenus();
  }

  onCargaMasiva() {
    this.router.navigate(['/usuario/carga-masiva']);
    this.closeMenus();
  }

  onPerfil() {
    this.router.navigate(['/perfil']);
    this.closeMenus();
  }

  onConfig() {
    this.router.navigate(['/configuracion']);
    this.closeMenus();
  }

  onLogout() {
    this.authService.logout();
    this.closeMenus();
  }

  // Método auxiliar para cerrar todos los menús
  private closeMenus() {
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
  }
}