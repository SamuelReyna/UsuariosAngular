import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { AlertService } from '../../services/alert/alert';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recovery-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './recovery-password.html',
  styleUrl: './recovery-password.css',
})
export class RecoveryPassword {
  password: string = '';
  confirmPassword: string = '';

  errorMessage: any;
  successMessage: any;
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private alertService = inject(AlertService);

  onSubmit() {
   const passwordData = {
      password: this.password,
      confirmPassword: this.confirmPassword,
    };
    const recoryToken = this.activatedRoute.snapshot.queryParamMap.get('token') || '';
    this.authService.changePass(passwordData, recoryToken).subscribe({
      next: () => {
        this.successMessage = 'Contraseña cambiada exitosamente.';
        this.alertService.success('Contraseña cambiada exitosamente.');
        this.errorMessage = null;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = 'Ocurrió un error al cambiar la contraseña.';
        this.alertService.error('Ocurrió un error al cambiar la contraseña.', error);
        this.successMessage = null;
        this.router.navigate(['/forgot-password']);
      },
    });
  }
}
