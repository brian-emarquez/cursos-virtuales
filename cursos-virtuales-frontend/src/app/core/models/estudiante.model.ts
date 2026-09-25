export interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  fechaRegistro: string;
}

export interface EstudianteRequest {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string | null;
}
