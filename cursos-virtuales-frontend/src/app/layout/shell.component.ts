import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { EstadoApiService } from '../core/services/estado-api.service';
import { TemaService } from '../core/services/tema.service';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog.component';
import { IconComponent } from '../shared/components/icon.component';
import { ToastContainerComponent } from '../shared/components/toast-container.component';

interface ItemMenu {
  ruta: string;
  etiqueta: string;
  icono: string;
}

// Estructura general: barra lateral + barra superior + contenido de cada página
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, ToastContainerComponent, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  protected tema = inject(TemaService);
  protected api = inject(EstadoApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected menuAbierto = signal(false);

  protected readonly menu: ItemMenu[] = [
    { ruta: '/dashboard', etiqueta: 'Dashboard', icono: 'dashboard' },
    { ruta: '/cursos', etiqueta: 'Cursos', icono: 'cursos' },
    { ruta: '/categorias', etiqueta: 'Categorías', icono: 'categorias' },
    { ruta: '/estudiantes', etiqueta: 'Estudiantes', icono: 'estudiantes' },
    { ruta: '/inscripciones', etiqueta: 'Inscripciones', icono: 'inscripciones' },
  ];

  // Lee "titulo" y "subtitulo" del data de la ruta activa (ver app.routes.ts)
  protected encabezado = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.datosRutaActual()),
    ),
    { initialValue: { titulo: '', subtitulo: '' } },
  );

  constructor() {
    this.api.verificar();
  }

  private datosRutaActual(): { titulo: string; subtitulo: string } {
    let r = this.route;
    while (r.firstChild) r = r.firstChild;
    const data = r.snapshot?.data ?? {};
    return { titulo: data['titulo'] ?? '', subtitulo: data['subtitulo'] ?? '' };
  }
}
