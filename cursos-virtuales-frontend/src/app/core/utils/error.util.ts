import { HttpErrorResponse } from '@angular/common/http';

// Convierte cualquier error HTTP del backend en un texto legible.
// El backend responde:
//   { "error": "mensaje" }                        → 404, 409, 400 simples
//   { "campo": "mensaje", "otro": "mensaje" }      → 400 de validación
export function mensajeDeError(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Error inesperado';

  if (err.status === 0) {
    return 'No se pudo conectar con el backend. ¿Está corriendo en http://localhost:8080?';
  }

  const cuerpo = err.error;
  if (cuerpo && typeof cuerpo === 'object') {
    if (typeof cuerpo['error'] === 'string') return cuerpo['error'];
    const mensajes = Object.values(cuerpo).filter(v => typeof v === 'string');
    if (mensajes.length) return mensajes.join(' · ');
  }
  return `Error ${err.status}: ${err.statusText || 'desconocido'}`;
}
