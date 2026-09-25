import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../api.config';
import { Curso, CursoRequest } from '../models/curso.model';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/cursos`;

  listar() {
    return this.http.get<Curso[]>(this.url);
  }

  listarActivos() {
    return this.http.get<Curso[]>(`${this.url}/activos`);
  }

  obtener(id: number) {
    return this.http.get<Curso>(`${this.url}/${id}`);
  }

  crear(data: CursoRequest) {
    return this.http.post<Curso>(this.url, data);
  }

  actualizar(id: number, data: CursoRequest) {
    return this.http.put<Curso>(`${this.url}/${id}`, data);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
