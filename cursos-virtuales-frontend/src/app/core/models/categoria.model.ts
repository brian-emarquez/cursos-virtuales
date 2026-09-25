// Lo que devuelve el backend (CategoriaResponse)
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

// Lo que enviamos al backend (CategoriaRequest)
export interface CategoriaRequest {
  nombre: string;
  descripcion: string | null;
}
