// alert.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertSubject.asObservable();

  success(message: string, duration: number = 3000) {
    this.showAlert('success', message, duration);
  }

  error(message: string, duration: number = 3000) {
    this.showAlert('error', message, duration);
  }

  warning(message: string, duration: number = 3000) {
    this.showAlert('warning', message, duration);
  }

  info(message: string, duration: number = 3000) {
    this.showAlert('info', message, duration);
  }

  private showAlert(type: Alert['type'], message: string, duration: number) {
    const id = Math.random().toString(36).substr(2, 9);
    const alert: Alert = { id, type, message };
    
    const currentAlerts = this.alertSubject.value;
    this.alertSubject.next([...currentAlerts, alert]);

    if (duration > 0) {
      setTimeout(() => this.removeAlert(id), duration);
    }
  }

  removeAlert(id: string) {
    const currentAlerts = this.alertSubject.value;
    this.alertSubject.next(currentAlerts.filter(alert => alert.id !== id));
  }
}