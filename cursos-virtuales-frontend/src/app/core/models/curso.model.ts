export type Nivel = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';

export const NIVELES: { valor: Nivel; etiqueta: string }[] = [
  { valor: 'BASICO', etiqueta: 'Básico' },
  { valor: 'INTERMEDIO', etiqueta: 'Intermedio' },
  { valor: 'AVANZADO', etiqueta: 'Avanzado' },
];

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string | null;
  instructor: string;
  precio: number;
  duracionHoras: number;
  nivel: Nivel;
  activo: boolean;
  fechaCreacion: string;
  categoriaId: number;
  categoriaNombre: string;
}

export interface CursoRequest {
  titulo: string;
  descripcion: string | null;
  instructor: string;
  precio: number;
  duracionHoras: number;
  nivel: Nivel;
  activo: boolean;
  categoriaId: number;
}
