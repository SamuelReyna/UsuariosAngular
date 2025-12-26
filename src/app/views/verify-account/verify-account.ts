import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-account',
  imports: [CommonModule],
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.css',
})
export class VerifyAccount implements OnInit {
  onLogin(): void {
    this.router1.navigate(['/login']);
  }
  private router1 = inject(Router);
  private token: string | null = null;
  verificationStatus: 'pending' | 'success' | 'error' = 'pending';
  errorMessage: string = '';
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.authService.verifyAccount(this.token).subscribe({
        next: (response) => {
          this.verificationStatus = 'success';
        },
        error: (error) => {
          this.verificationStatus = 'error';
          this.errorMessage = error.message;
        },
      });
    } else {
      this.verificationStatus = 'error';
      this.errorMessage = 'Token de verificación no proporcionado.';
    }

    // Lógica de verificación de cuenta aquí
  }
}
