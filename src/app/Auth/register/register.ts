// register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { AlertService } from '../../services/alert/alert';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  // Datos del usuario
  nombreUsuario: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  username: string = '';
  email: string = '';
  telefono: string = '';
  fechaNacimiento: string = '';
  celular: string = '';
  curp: string = '';
  sexo: string = '';
  password: string = '';
  confirmPassword: string = '';
  aceptaTerminos: boolean = false;

  // Estados
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string = '';
  isLoading = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  validateForm(): boolean {
    // Validar campos requeridos
    if (
      !this.nombreUsuario ||
      !this.apellidoPaterno ||
      !this.username ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Todos los campos marcados con * son obligatorios';
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'El email no es válido';
      return false;
    }

    // Validar contraseña
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    // Validar coincidencia de contraseñas
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }

    // Validar CURP si está presente
    // if (this.curp && this.curp.length !== 18) {
    //   this.errorMessage = 'El CURP debe tener 18 caracteres';
    //   return false;
    // }

    return true;
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const userData = {
      nombreUsuario: this.nombreUsuario,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      username: this.username,
      email: this.email,
      telefono: this.telefono,
      fechaNacimiento: this.fechaNacimiento,
      celular: this.celular,
      curp: this.curp.toUpperCase(),
      sexo: this.sexo,
      password: this.password,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.alertService.success('Registro exitoso. Por favor, inicia sesión.');
        this.router.navigate(['/email-sent']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message || 'Error al registrar usuario. Intenta nuevamente.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}

// register.component.html
/*
<div class="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
  <div class="w-full max-w-4xl">
    <!-- Card -->
    <div class="bg-slate-800 rounded-lg shadow-xl p-8">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Mi App</h1>
        <p class="text-slate-400">Crea tu cuenta</p>
      </div>

      <!-- Mensaje de Error -->
      <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
        <p class="text-red-500 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Form -->
      <form (ngSubmit)="onSubmit()">
        <!-- Información Personal -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Información Personal
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nombre -->
            <div>
              <label for="nombreUsuario" class="block text-sm font-medium text-slate-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                id="nombreUsuario"
                name="nombreUsuario"
                [(ngModel)]="nombreUsuario"
                required
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Juan"
              />
            </div>

            <!-- Apellido Paterno -->
            <div>
              <label for="apellidoPaterno" class="block text-sm font-medium text-slate-300 mb-2">
                Apellido Paterno *
              </label>
              <input
                type="text"
                id="apellidoPaterno"
                name="apellidoPaterno"
                [(ngModel)]="apellidoPaterno"
                required
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Pérez"
              />
            </div>

            <!-- Apellido Materno -->
            <div>
              <label for="apellidoMaterno" class="block text-sm font-medium text-slate-300 mb-2">
                Apellido Materno
              </label>
              <input
                type="text"
                id="apellidoMaterno"
                name="apellidoMaterno"
                [(ngModel)]="apellidoMaterno"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="García"
              />
            </div>

            <!-- Fecha de Nacimiento -->
            <div>
              <label for="fechaNacimiento" class="block text-sm font-medium text-slate-300 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                [(ngModel)]="fechaNacimiento"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <!-- Sexo -->
            <div>
              <label for="sexo" class="block text-sm font-medium text-slate-300 mb-2">
                Sexo
              </label>
              <select
                id="sexo"
                name="sexo"
                [(ngModel)]="sexo"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecciona...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <!-- CURP -->
            <div>
              <label for="curp" class="block text-sm font-medium text-slate-300 mb-2">
                CURP
              </label>
              <input
                type="text"
                id="curp"
                name="curp"
                [(ngModel)]="curp"
                maxlength="18"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors uppercase"
                placeholder="PEGG900101HDFRRL09"
              />
            </div>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Información de Contacto
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
                Email *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="email"
                  required
                  class="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <!-- Teléfono -->
            <div>
              <label for="telefono" class="block text-sm font-medium text-slate-300 mb-2">
                Teléfono
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  [(ngModel)]="telefono"
                  class="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="5512345678"
                />
              </div>
            </div>

            <!-- Celular -->
            <div>
              <label for="celular" class="block text-sm font-medium text-slate-300 mb-2">
                Celular
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="celular"
                  name="celular"
                  [(ngModel)]="celular"
                  class="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="5512345678"
                />
              </div>
            </div>

            <!-- Username -->
            <div>
              <label for="username" class="block text-sm font-medium text-slate-300 mb-2">
                Nombre de Usuario *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  [(ngModel)]="username"
                  required
                  class="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="usuario123"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Seguridad -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Seguridad
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Contraseña -->
            <div>
              <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
                Contraseña *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  [(ngModel)]="password"
                  required
                  class="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                >
                  <svg *ngIf="!showPassword" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirmar Contraseña -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-slate-300 mb-2">
                Confirmar Contraseña *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  required
                  class="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  (click)="toggleConfirmPassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                >
                  <svg *ngIf="!showConfirmPassword" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showConfirmPassword" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Términos y Condiciones -->
        <div class="mb-6">
          <label class="flex items-start text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              name="aceptaTerminos"
              [(ngModel)]="aceptaTerminos"
              class="mt-1 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="ml-2">
              Acepto los <a href="#" class="text-blue-400 hover:text-blue-300">términos y condiciones</a>
              y la <a href="#" class="text-blue-400 hover:text-blue-300">política de privacidad</a> *
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="isLoading"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center"
        >
          <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Registrando...' : 'Crear Cuenta' }}
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-slate-400">
          ¿Ya tienes cuenta?
          <button (click)="onLogin()" class="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  </div>
</div>
*/
