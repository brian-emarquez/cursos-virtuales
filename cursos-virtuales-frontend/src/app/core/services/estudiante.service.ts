import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../api.config';
import { Estudiante, EstudianteRequest } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private http = inject(HttpClient);
  private url = `${API_URL}/estudiantes`;

  listar() {
    return this.http.get<Estudiante[]>(this.url);
  }

  crear(data: EstudianteRequest) {
    return this.http.post<Estudiante>(this.url, data);
  }

  actualizar(id: number, data: EstudianteRequest) {
    return this.http.put<Estudiante>(`${this.url}/${id}`, data);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
