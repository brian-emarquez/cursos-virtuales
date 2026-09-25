import { Injectable, signal } from '@angular/core';

export type TipoToast = 'exito' | 'error' | 'info';

export interface Toast {
  id: number;
  tipo: TipoToast;
  titulo: string;
  mensaje: string;
}

// Notificaciones flotantes (esquina inferior derecha)
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private contador = 0;

  exito(mensaje: string, titulo = 'Listo') {
    this.mostrar('exito', titulo, mensaje);
  }

  error(mensaje: string, titulo = 'Ocurrió un error') {
    this.mostrar('error', titulo, mensaje, 6000);
  }

  info(mensaje: string, titulo = 'Información') {
    this.mostrar('info', titulo, mensaje);
  }

  cerrar(id: number) {
    this.toasts.update(lista => lista.filter(t => t.id !== id));
  }

  private mostrar(tipo: TipoToast, titulo: string, mensaje: string, duracion = 4000) {
    const id = ++this.contador;
    this.toasts.update(lista => [...lista, { id, tipo, titulo, mensaje }]);
    setTimeout(() => this.cerrar(id), duracion);
  }
}
