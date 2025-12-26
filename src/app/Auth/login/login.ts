import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importa FormsModule
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  onRegister() {
    this.router.navigate(['/register']);
  }
  username = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  errorMessage = '';

  ngOnInit(): void {
    if (!this.authService.isExpired()) {
      this.router.navigate(['/']);
    } else {
      this.authService.logout();
    }
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  private authService = inject(AuthService);
  private router = inject(Router);
  onSubmit() {
    if (this.username && this.password) {
      // Aquí implementas tu lógica de autenticación

      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          if (response.token) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.errorMessage;
            this.username = '';
            this.password = '';
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Usuario o contraseña incorrectos';
          this.username = '';
          this.password = '';
        },
      });

      // this.authService.login(this.email, this.password).subscribe(...)
    }
  }
}
