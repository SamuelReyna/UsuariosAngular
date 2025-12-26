import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enviar-email',
  imports: [],
  templateUrl: './enviar-email.html',
  styleUrl: './enviar-email.css',
})
export class EnviarEmail {
  onLogin() {
    this.router.navigate(['/login']);
  }
  private router = inject(Router);
}
