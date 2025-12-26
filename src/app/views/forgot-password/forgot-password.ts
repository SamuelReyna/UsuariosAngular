import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  onlogin() {
    this.router.navigate(['/login']);
  }
  private router = inject(Router);
  successMessage: any;
  errorMessage: any;
  onSubmit() {
    this.authService.recoveryPassword(this.email).subscribe({
      next: (response) => {
        this.successMessage = 'Correo de recuperación enviado exitosamente.';
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Ocurrió un error al enviar el correo de recuperación.';
        this.successMessage = null;
      },
    });
  }
  private authService = inject(AuthService);
  email: any;
}
