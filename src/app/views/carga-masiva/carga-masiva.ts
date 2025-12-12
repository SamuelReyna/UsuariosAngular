import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-carga-masiva',
  imports: [CommonModule, Navbar],
  templateUrl: './carga-masiva.html',
  styleUrl: './carga-masiva.css',
})
export class CargaMasiva {
  file: File | null = null;
  isDragging = false;
  error = '';
  processing = false;

  allowedExtensions = ['.txt', '.xls', '.xlsx'];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!this.allowedExtensions.includes(extension)) {
      this.error = 'Solo se permiten archivos .txt, .xls o .xlsx';
      this.file = null;
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.error = 'El archivo no debe superar los 10MB';
      this.file = null;
      return;
    }

    this.error = '';
    this.file = file;
  }

  removeFile(): void {
    this.file = null;
    this.error = '';
  }

  processFile(): void {
    if (!this.file) return;

    this.processing = true;

    // Aquí va tu lógica de procesamiento
    // Por ejemplo, enviar el archivo a tu servicio:
    // this.fileService.uploadFile(this.file).subscribe({
    //   next: (response) => {
    //     console.log('Archivo procesado', response);
    //     this.processing = false;
    //   },
    //   error: (err) => {
    //     this.error = 'Error al procesar el archivo';
    //     this.processing = false;
    //   }
    // });

    // Simulación temporal:
    setTimeout(() => {
      alert(`Archivo "${this.file!.name}" procesado exitosamente`);
      this.processing = false;
    }, 2000);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
