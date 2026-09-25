import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';

// Cada página se carga solo cuando se visita (lazy loading con loadComponent)
export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { titulo: 'Dashboard', subtitulo: 'Resumen general de la plataforma' },
      },
      {
        path: 'cursos',
        loadComponent: () => import('./pages/cursos/cursos.component').then(m => m.CursosComponent),
        data: { titulo: 'Cursos', subtitulo: 'Administra el catálogo de cursos virtuales' },
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent),
        data: { titulo: 'Categorías', subtitulo: 'Organiza los cursos por área temática' },
      },
      {
        path: 'estudiantes',
        loadComponent: () => import('./pages/estudiantes/estudiantes.component').then(m => m.EstudiantesComponent),
        data: { titulo: 'Estudiantes', subtitulo: 'Gestiona a los alumnos registrados' },
      },
      {
        path: 'inscripciones',
        loadComponent: () => import('./pages/inscripciones/inscripciones.component').then(m => m.InscripcionesComponent),
        data: { titulo: 'Inscripciones', subtitulo: 'Matrículas de estudiantes en cursos' },
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
