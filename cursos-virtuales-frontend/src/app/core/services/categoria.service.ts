import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../api.config';
import { Categoria, CategoriaRequest } from '../models/categoria.model';

// Cada método corresponde a un endpoint de CategoriaController
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = `${API_URL}/categorias`;

  listar() {
    return this.http.get<Categoria[]>(this.url);
  }

  obtener(id: number) {
    return this.http.get<Categoria>(`${this.url}/${id}`);
  }

  crear(data: CategoriaRequest) {
    return this.http.post<Categoria>(this.url, data);
  }

  actualizar(id: number, data: CategoriaRequest) {
    return this.http.put<Categoria>(`${this.url}/${id}`, data);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
