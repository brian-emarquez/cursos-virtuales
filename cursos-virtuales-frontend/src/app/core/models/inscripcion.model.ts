export type EstadoInscripcion = 'ACTIVA' | 'COMPLETADA' | 'CANCELADA';

export const ESTADOS: { valor: EstadoInscripcion; etiqueta: string }[] = [
  { valor: 'ACTIVA', etiqueta: 'Activa' },
  { valor: 'COMPLETADA', etiqueta: 'Completada' },
  { valor: 'CANCELADA', etiqueta: 'Cancelada' },
];

export interface Inscripcion {
  id: number;
  fechaInscripcion: string;
  estado: EstadoInscripcion;
  estudianteId: number;
  estudianteNombre: string;
  cursoId: number;
  cursoTitulo: string;
}

export interface InscripcionRequest {
  estudianteId: number;
  cursoId: number;
}
