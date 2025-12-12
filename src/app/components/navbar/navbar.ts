import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth/auth';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
isUserMenuOpen = false;
userImage = ''; // opcional, reemplaza con la URL real si la tienes

toggleUserMenu() {
  this.isUserMenuOpen = !this.isUserMenuOpen;
}

closeUserMenu() {
  this.isUserMenuOpen = false;
}

onPerfil() {
  console.log("Perfil");
  // navega a /perfil
}

onConfig() {
  console.log("Config");
  // navega a /configuracion
}


  private storage = inject(StorageService);
  private authService = inject(AuthService);

  user: string = '';
  role: string = '';
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.user = this.storage.getItem('user') || '';
      this.role = this.storage.getItem('role') || '';
    } else {
      this.router.navigate(['/login']);
    }
  }

  constructor(private router: Router) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  onHome() {
    this.router.navigate(['/']);
  }

  onUsuarios() {
    this.router.navigate(['/usuario']);
  }

  onCargaMasiva() {
    this.router.navigate(['usuario/carga-masiva']);
  }

  onLogout() {
    this.authService.logout();
  }
}
