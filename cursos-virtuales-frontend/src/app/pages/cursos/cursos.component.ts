import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../core/models/categoria.model';
import { Curso, CursoRequest, NIVELES, Nivel } from '../../core/models/curso.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { CursoService } from '../../core/services/curso.service';
import { ToastService } from '../../core/services/toast.service';
import { mensajeDeError } from '../../core/utils/error.util';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { IconComponent } from '../../shared/components/icon.component';
import { ModalComponent } from '../../shared/components/modal.component';

type FiltroEstado = 'todos' | 'activos' | 'inactivos';

@Component({
  selector: 'app-cursos',
  imports: [ReactiveFormsModule, CurrencyPipe, IconComponent, ModalComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss',
})
export class CursosComponent {
  private cursoService = inject(CursoService);
  private categoriaService = inject(CategoriaService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  private fb = inject(FormBuilder);

  protected readonly niveles = NIVELES;

  // ---------- Datos ----------
  protected cursos = signal<Curso[]>([]);
  protected categorias = signal<Categoria[]>([]);
  protected cargando = signal(true);
  protected errorCarga = signal<string | null>(null);

  // ---------- Filtros ----------
  protected busqueda = signal('');
  protected filtroCategoria = signal<number | null>(null);
  protected filtroNivel = signal<Nivel | null>(null);
  protected filtroEstado = signal<FiltroEstado>('todos');

  protected filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const cat = this.filtroCategoria();
    const nivel = this.filtroNivel();
    const estado = this.filtroEstado();

    return this.cursos().filter(c =>
      (c.titulo.toLowerCase().includes(texto) || c.instructor.toLowerCase().includes(texto)) &&
      (cat === null || c.categoriaId === cat) &&
      (nivel === null || c.nivel === nivel) &&
      (estado === 'todos' || (estado === 'activos' ? c.activo : !c.activo)),
    );
  });

  protected totalActivos = computed(() => this.cursos().filter(c => c.activo).length);

  protected hayFiltros = computed(() =>
    !!this.busqueda() || this.filtroCategoria() !== null || this.filtroNivel() !== null || this.filtroEstado() !== 'todos',
  );

  // ---------- Modal / formulario ----------
  protected modalAbierto = signal(false);
  protected editando = signal<Curso | null>(null);
  protected guardando = signal(false);

  protected form = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', [Validators.maxLength(500)]],
    instructor: ['', [Validators.required, Validators.maxLength(100)]],
    precio: [null as number | null, [Validators.required, Validators.min(0)]],
    duracionHoras: [null as number | null, [Validators.required, Validators.min(1)]],
    nivel: ['BASICO' as Nivel, [Validators.required]],
    categoriaId: [null as number | null, [Validators.required]],
    activo: [true],
  });

  constructor() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.errorCarga.set(null);
    forkJoin({
      cursos: this.cursoService.listar(),
      categorias: this.categoriaService.listar(),
    }).subscribe({
      next: ({ cursos, categorias }) => {
        this.cursos.set(cursos);
        this.categorias.set(categorias);
        this.cargando.set(false);
      },
      error: err => {
        this.errorCarga.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  // ---------- Filtros desde el HTML ----------
  cambiarCategoria(valor: string) {
    this.filtroCategoria.set(valor ? Number(valor) : null);
  }

  cambiarNivel(valor: string) {
    this.filtroNivel.set(valor ? (valor as Nivel) : null);
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.filtroCategoria.set(null);
    this.filtroNivel.set(null);
    this.filtroEstado.set('todos');
  }

  // ---------- Crear / editar ----------
  abrirNuevo() {
    this.editando.set(null);
    this.form.reset({ nivel: 'BASICO', activo: true, categoriaId: this.categorias()[0]?.id ?? null });
    this.modalAbierto.set(true);
  }

  abrirEditar(curso: Curso) {
    this.editando.set(curso);
    this.form.reset({
      titulo: curso.titulo,
      descripcion: curso.descripcion ?? '',
      instructor: curso.instructor,
      precio: curso.precio,
      duracionHoras: curso.duracionHoras,
      nivel: curso.nivel,
      categoriaId: curso.categoriaId,
      activo: curso.activo,
    });
    this.modalAbierto.set(true);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const datos: CursoRequest = {
      titulo: v.titulo!.trim(),
      descripcion: v.descripcion?.trim() || null,
      instructor: v.instructor!.trim(),
      precio: Number(v.precio),
      duracionHoras: Number(v.duracionHoras),
      nivel: v.nivel!,
      activo: !!v.activo,
      categoriaId: Number(v.categoriaId),
    };

    const actual = this.editando();
    const peticion = actual ? this.cursoService.actualizar(actual.id, datos) : this.cursoService.crear(datos);

    this.guardando.set(true);
    peticion.subscribe({
      next: curso => {
        this.toast.exito(`Curso "${curso.titulo}" ${actual ? 'actualizado' : 'creado'} correctamente`);
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.cargar();
      },
      error: err => {
        this.toast.error(mensajeDeError(err));
        this.guardando.set(false);
      },
    });
  }

  // Activar / desactivar directo desde la tabla (usa el PUT del backend)
  alternarActivo(curso: Curso) {
    const datos: CursoRequest = {
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      instructor: curso.instructor,
      precio: curso.precio,
      duracionHoras: curso.duracionHoras,
      nivel: curso.nivel,
      activo: !curso.activo,
      categoriaId: curso.categoriaId,
    };
    this.cursoService.actualizar(curso.id, datos).subscribe({
      next: actualizado => {
        this.cursos.update(lista => lista.map(c => (c.id === actualizado.id ? actualizado : c)));
        this.toast.exito(`"${actualizado.titulo}" ahora está ${actualizado.activo ? 'activo' : 'inactivo'}`);
      },
      error: err => this.toast.error(mensajeDeError(err)),
    });
  }

  async eliminar(curso: Curso) {
    const ok = await this.confirm.preguntar({
      titulo: 'Eliminar curso',
      mensaje: `¿Eliminar "${curso.titulo}"? Si tiene estudiantes inscritos no se podrá eliminar; en ese caso desactívalo.`,
      textoConfirmar: 'Sí, eliminar',
      peligro: true,
    });
    if (!ok) return;

    this.cursoService.eliminar(curso.id).subscribe({
      next: () => {
        this.toast.exito(`Curso "${curso.titulo}" eliminado`);
        this.cargar();
      },
      error: err => this.toast.error(mensajeDeError(err), 'No se pudo eliminar'),
    });
  }

  // ---------- Ayudas para el HTML ----------
  invalido(campo: keyof typeof this.form.controls) {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  etiquetaNivel(nivel: Nivel) {
    return NIVELES.find(n => n.valor === nivel)?.etiqueta ?? nivel;
  }

  iniciales(texto: string) {
    return texto.split(' ').slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase();
  }
}
