import { Injectable, signal } from '@angular/core';

export type Tema = 'light' | 'dark';

// Modo claro / oscuro. Se guarda en el navegador para recordarlo.
@Injectable({ providedIn: 'root' })
export class TemaService {
  readonly tema = signal<Tema>(this.leerInicial());

  constructor() {
    this.aplicar(this.tema());
  }

  alternar() {
    const nuevo: Tema = this.tema() === 'light' ? 'dark' : 'light';
    this.tema.set(nuevo);
    this.aplicar(nuevo);
    try { localStorage.setItem('tema', nuevo); } catch { /* sin almacenamiento */ }
  }

  private aplicar(tema: Tema) {
    document.documentElement.setAttribute('data-theme', tema);
  }

  private leerInicial(): Tema {
    try {
      const guardado = localStorage.getItem('tema');
      if (guardado === 'light' || guardado === 'dark') return guardado;
    } catch { /* sin almacenamiento */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
