import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { API_URL } from '../api.config';

export type EstadoConexion = 'verificando' | 'conectado' | 'desconectado';

// Consulta GET /api/estado para saber si el backend está encendido
@Injectable({ providedIn: 'root' })
export class EstadoApiService {
  private http = inject(HttpClient);
  readonly estado = signal<EstadoConexion>('verificando');

  verificar() {
    this.estado.set('verificando');
    this.http.get(`${API_URL}/estado`).subscribe({
      next: () => this.estado.set('conectado'),
      error: () => this.estado.set('desconectado'),
    });
  }
}
