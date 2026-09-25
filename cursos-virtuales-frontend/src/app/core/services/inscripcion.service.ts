import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../api.config';
import { EstadoInscripcion, Inscripcion, InscripcionRequest } from '../models/inscripcion.model';

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  private http = inject(HttpClient);
  private url = `${API_URL}/inscripciones`;

  listar() {
    return this.http.get<Inscripcion[]>(this.url);
  }

  inscribir(data: InscripcionRequest) {
    return this.http.post<Inscripcion>(this.url, data);
  }

  // PATCH /api/inscripciones/{id}/estado
  cambiarEstado(id: number, estado: EstadoInscripcion) {
    return this.http.patch<Inscripcion>(`${this.url}/${id}/estado`, { estado });
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
