import { Injectable, signal } from '@angular/core';

export interface OpcionesConfirmacion {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  peligro?: boolean;
}

// Diálogo de confirmación reutilizable:
//   const ok = await this.confirm.preguntar({ titulo: '...', mensaje: '...' });
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly actual = signal<OpcionesConfirmacion | null>(null);
  private resolver?: (valor: boolean) => void;

  preguntar(opciones: OpcionesConfirmacion): Promise<boolean> {
    this.actual.set(opciones);
    return new Promise<boolean>(resolve => (this.resolver = resolve));
  }

  responder(valor: boolean) {
    this.actual.set(null);
    this.resolver?.(valor);
    this.resolver = undefined;
  }
}
