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
  private storage = inject(StorageService);
  private authService = inject(AuthService);
  jwtExist: boolean = false;
  jwtToken = 'jwt-token';
  user: string = '';
  role: string = '';
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.jwtExist = !!this.storage.getItem(this.jwtToken);
      this.user = this.storage.getItem('user') || '';
      this.role = this.storage.getItem('role') || '';
    } else {
      this.router.navigate(['/login']);
    }
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.jwtExist = !event.url.includes('/login');
        if (this.storage.getItem(this.jwtToken) !== null) {
          this.jwtExist = !!this.storage.getItem(this.jwtToken);
        }
      });
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
    this.storage.removeItem(this.jwtToken);
    this.router.navigate(['login']);
  }
}
