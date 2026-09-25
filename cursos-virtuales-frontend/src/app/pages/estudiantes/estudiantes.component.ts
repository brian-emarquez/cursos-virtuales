import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Estudiante, EstudianteRequest } from '../../core/models/estudiante.model';
import { ConfirmService } from '../../core/services/confirm.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { ToastService } from '../../core/services/toast.service';
import { mensajeDeError } from '../../core/utils/error.util';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { IconComponent } from '../../shared/components/icon.component';
import { ModalComponent } from '../../shared/components/modal.component';

interface EstudianteConConteo extends Estudiante {
  totalInscripciones: number;
}

@Component({
  selector: 'app-estudiantes',
  imports: [ReactiveFormsModule, DatePipe, RouterLink, IconComponent, ModalComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './estudiantes.component.html',
})
export class EstudiantesComponent {
  private estudianteService = inject(EstudianteService);
  private inscripcionService = inject(InscripcionService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  private fb = inject(FormBuilder);

  protected estudiantes = signal<EstudianteConConteo[]>([]);
  protected cargando = signal(true);
  protected errorCarga = signal<string | null>(null);
  protected busqueda = signal('');

  protected filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    return this.estudiantes().filter(e =>
      `${e.nombres} ${e.apellidos} ${e.email}`.toLowerCase().includes(texto),
    );
  });

  protected conInscripciones = computed(() => this.estudiantes().filter(e => e.totalInscripciones > 0).length);

  protected modalAbierto = signal(false);
  protected editando = signal<Estudiante | null>(null);
  protected guardando = signal(false);

  protected form = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    telefono: ['', [Validators.maxLength(20), Validators.pattern(/^[0-9+\s-]*$/)]],
  });

  constructor() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.errorCarga.set(null);
    forkJoin({
      estudiantes: this.estudianteService.listar(),
      inscripciones: this.inscripcionService.listar(),
    }).subscribe({
      next: ({ estudiantes, inscripciones }) => {
        this.estudiantes.set(
          estudiantes.map(e => ({
            ...e,
            totalInscripciones: inscripciones.filter(i => i.estudianteId === e.id).length,
          })),
        );
        this.cargando.set(false);
      },
      error: err => {
        this.errorCarga.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  abrirNuevo() {
    this.editando.set(null);
    this.form.reset();
    this.modalAbierto.set(true);
  }

  abrirEditar(e: Estudiante) {
    this.editando.set(e);
    this.form.reset({ nombres: e.nombres, apellidos: e.apellidos, email: e.email, telefono: e.telefono ?? '' });
    this.modalAbierto.set(true);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: EstudianteRequest = {
      nombres: v.nombres.trim(),
      apellidos: v.apellidos.trim(),
      email: v.email.trim(),
      telefono: v.telefono.trim() || null,
    };

    const actual = this.editando();
    const peticion = actual
      ? this.estudianteService.actualizar(actual.id, datos)
      : this.estudianteService.crear(datos);

    this.guardando.set(true);
    peticion.subscribe({
      next: e => {
        this.toast.exito(`${e.nombres} ${e.apellidos} ${actual ? 'actualizado' : 'registrado'} correctamente`);
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.cargar();
      },
      error: err => {
        // Ej: 409 "El email ya está registrado"
        this.toast.error(mensajeDeError(err));
        this.guardando.set(false);
      },
    });
  }

  async eliminar(e: EstudianteConConteo) {
    const ok = await this.confirm.preguntar({
      titulo: 'Eliminar estudiante',
      mensaje: `¿Eliminar a ${e.nombres} ${e.apellidos}? Si tiene inscripciones no se podrá eliminar.`,
      textoConfirmar: 'Sí, eliminar',
      peligro: true,
    });
    if (!ok) return;

    this.estudianteService.eliminar(e.id).subscribe({
      next: () => {
        this.toast.exito(`${e.nombres} ${e.apellidos} fue eliminado`);
        this.cargar();
      },
      error: err => this.toast.error(mensajeDeError(err), 'No se pudo eliminar'),
    });
  }

  invalido(campo: keyof typeof this.form.controls) {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  iniciales(e: Estudiante) {
    return (e.nombres.charAt(0) + e.apellidos.charAt(0)).toUpperCase();
  }
}
