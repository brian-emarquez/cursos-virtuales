import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Curso } from '../../core/models/curso.model';
import { Estudiante } from '../../core/models/estudiante.model';
import { ESTADOS, EstadoInscripcion, Inscripcion } from '../../core/models/inscripcion.model';
import { ConfirmService } from '../../core/services/confirm.service';
import { CursoService } from '../../core/services/curso.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { ToastService } from '../../core/services/toast.service';
import { mensajeDeError } from '../../core/utils/error.util';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { IconComponent } from '../../shared/components/icon.component';
import { ModalComponent } from '../../shared/components/modal.component';

type FiltroEstado = EstadoInscripcion | 'TODAS';

@Component({
  selector: 'app-inscripciones',
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, IconComponent, ModalComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inscripciones.component.html',
  styleUrl: './inscripciones.component.scss',
})
export class InscripcionesComponent {
  private inscripcionService = inject(InscripcionService);
  private estudianteService = inject(EstudianteService);
  private cursoService = inject(CursoService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  private fb = inject(FormBuilder);

  protected readonly estados = ESTADOS;

  // Llega desde la URL: /inscripciones?estudianteId=1  (gracias a withComponentInputBinding)
  estudianteId = input<string>();

  // ---------- Datos ----------
  protected inscripciones = signal<Inscripcion[]>([]);
  protected estudiantes = signal<Estudiante[]>([]);
  protected cursos = signal<Curso[]>([]);
  protected cargando = signal(true);
  protected errorCarga = signal<string | null>(null);

  // ---------- Filtros ----------
  protected busqueda = signal('');
  protected filtroEstado = signal<FiltroEstado>('TODAS');
  protected filtroEstudiante = linkedSignal<number | null>(() =>
    this.estudianteId() ? Number(this.estudianteId()) : null,
  );
  protected filtroCurso = signal<number | null>(null);

  // Primero se aplican los filtros de estudiante, curso y búsqueda…
  private base = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const est = this.filtroEstudiante();
    const cur = this.filtroCurso();
    return this.inscripciones().filter(i =>
      (est === null || i.estudianteId === est) &&
      (cur === null || i.cursoId === cur) &&
      `${i.estudianteNombre} ${i.cursoTitulo}`.toLowerCase().includes(texto),
    );
  });

  // …luego el estado (así los contadores de las pestañas son correctos)
  protected filtradas = computed(() => {
    const estado = this.filtroEstado();
    const lista = estado === 'TODAS' ? this.base() : this.base().filter(i => i.estado === estado);
    return [...lista].sort((a, b) => b.fechaInscripcion.localeCompare(a.fechaInscripcion));
  });

  protected conteo = computed(() => {
    const lista = this.base();
    return {
      TODAS: lista.length,
      ACTIVA: lista.filter(i => i.estado === 'ACTIVA').length,
      COMPLETADA: lista.filter(i => i.estado === 'COMPLETADA').length,
      CANCELADA: lista.filter(i => i.estado === 'CANCELADA').length,
    };
  });

  protected cursosActivos = computed(() => this.cursos().filter(c => c.activo));

  // ---------- Modal ----------
  protected modalAbierto = signal(false);
  protected guardando = signal(false);

  protected form = this.fb.group({
    estudianteId: [null as number | null, Validators.required],
    cursoId: [null as number | null, Validators.required],
  });

  constructor() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.errorCarga.set(null);
    forkJoin({
      inscripciones: this.inscripcionService.listar(),
      estudiantes: this.estudianteService.listar(),
      cursos: this.cursoService.listar(),
    }).subscribe({
      next: ({ inscripciones, estudiantes, cursos }) => {
        this.inscripciones.set(inscripciones);
        this.estudiantes.set(estudiantes);
        this.cursos.set(cursos);
        this.cargando.set(false);
      },
      error: err => {
        this.errorCarga.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  cambiarEstudiante(valor: string) {
    this.filtroEstudiante.set(valor ? Number(valor) : null);
  }

  cambiarCurso(valor: string) {
    this.filtroCurso.set(valor ? Number(valor) : null);
  }

  // Curso elegido en el modal (para mostrar su resumen)
  cursoSeleccionado(): Curso | undefined {
    const id = this.form.controls.cursoId.value;
    return this.cursos().find(c => c.id === id);
  }

  abrirNueva() {
    this.form.reset({ estudianteId: this.filtroEstudiante(), cursoId: null });
    this.modalAbierto.set(true);
  }

  inscribir() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { estudianteId, cursoId } = this.form.getRawValue();

    this.guardando.set(true);
    this.inscripcionService.inscribir({ estudianteId: estudianteId!, cursoId: cursoId! }).subscribe({
      next: i => {
        this.toast.exito(`${i.estudianteNombre} fue inscrito en "${i.cursoTitulo}"`, 'Inscripción registrada');
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.cargar();
      },
      error: err => {
        // 409 si ya estaba inscrito o si el curso está inactivo
        this.toast.error(mensajeDeError(err), 'No se pudo inscribir');
        this.guardando.set(false);
      },
    });
  }

  async cambiarEstado(i: Inscripcion, estado: EstadoInscripcion) {
    if (estado === 'CANCELADA') {
      const ok = await this.confirm.preguntar({
        titulo: 'Cancelar inscripción',
        mensaje: `Una inscripción cancelada ya no puede reactivarse. ¿Cancelar la inscripción de ${i.estudianteNombre}?`,
        textoConfirmar: 'Sí, cancelar',
        peligro: true,
      });
      if (!ok) return;
    }

    this.inscripcionService.cambiarEstado(i.id, estado).subscribe({
      next: actualizada => {
        this.inscripciones.update(lista => lista.map(x => (x.id === actualizada.id ? actualizada : x)));
        this.toast.exito(`La inscripción ahora está ${this.etiquetaEstado(actualizada.estado).toLowerCase()}`);
      },
      error: err => this.toast.error(mensajeDeError(err)),
    });
  }

  async eliminar(i: Inscripcion) {
    const ok = await this.confirm.preguntar({
      titulo: 'Eliminar inscripción',
      mensaje: `¿Eliminar la inscripción de ${i.estudianteNombre} en "${i.cursoTitulo}"?`,
      textoConfirmar: 'Sí, eliminar',
      peligro: true,
    });
    if (!ok) return;

    this.inscripcionService.eliminar(i.id).subscribe({
      next: () => {
        this.inscripciones.update(lista => lista.filter(x => x.id !== i.id));
        this.toast.exito('Inscripción eliminada');
      },
      error: err => this.toast.error(mensajeDeError(err)),
    });
  }

  etiquetaEstado(estado: EstadoInscripcion) {
    return ESTADOS.find(e => e.valor === estado)?.etiqueta ?? estado;
  }

  iniciales(nombre: string) {
    return nombre.split(' ').slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase();
  }

  invalido(campo: 'estudianteId' | 'cursoId') {
    const c = this.form.controls[campo];
    return c.invalid && c.touched;
  }
}
