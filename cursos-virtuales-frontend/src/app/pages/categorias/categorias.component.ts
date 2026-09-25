import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { CursoService } from '../../core/services/curso.service';
import { ToastService } from '../../core/services/toast.service';
import { mensajeDeError } from '../../core/utils/error.util';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { IconComponent } from '../../shared/components/icon.component';
import { ModalComponent } from '../../shared/components/modal.component';

// Una categoría + cuántos cursos tiene (calculado en el front)
interface CategoriaConConteo extends Categoria {
  totalCursos: number;
  cursosActivos: number;
}

@Component({
  selector: 'app-categorias',
  imports: [ReactiveFormsModule, IconComponent, ModalComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export class CategoriasComponent {
  private categoriaService = inject(CategoriaService);
  private cursoService = inject(CursoService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);
  private fb = inject(FormBuilder);

  // ---------- Estado de la página (signals) ----------
  protected categorias = signal<CategoriaConConteo[]>([]);
  protected cargando = signal(true);
  protected errorCarga = signal<string | null>(null);
  protected busqueda = signal('');

  protected modalAbierto = signal(false);
  protected editando = signal<Categoria | null>(null);
  protected guardando = signal(false);

  // Lista filtrada: se recalcula sola cuando cambia la búsqueda o los datos
  protected filtradas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    return this.categorias().filter(c =>
      c.nombre.toLowerCase().includes(texto) || (c.descripcion ?? '').toLowerCase().includes(texto),
    );
  });

  // ---------- Formulario ----------
  protected form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(255)]],
  });

  constructor() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.errorCarga.set(null);

    // forkJoin: espera a que terminen ambas peticiones
    forkJoin({
      categorias: this.categoriaService.listar(),
      cursos: this.cursoService.listar(),
    }).subscribe({
      next: ({ categorias, cursos }) => {
        this.categorias.set(
          categorias.map(cat => ({
            ...cat,
            totalCursos: cursos.filter(c => c.categoriaId === cat.id).length,
            cursosActivos: cursos.filter(c => c.categoriaId === cat.id && c.activo).length,
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

  abrirNueva() {
    this.editando.set(null);
    this.form.reset();
    this.modalAbierto.set(true);
  }

  abrirEditar(cat: Categoria) {
    this.editando.set(cat);
    this.form.reset({ nombre: cat.nombre, descripcion: cat.descripcion ?? '' });
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const datos = { nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim() || null };
    const actual = this.editando();

    // Si estamos editando → PUT, si no → POST
    const peticion = actual
      ? this.categoriaService.actualizar(actual.id, datos)
      : this.categoriaService.crear(datos);

    this.guardando.set(true);
    peticion.subscribe({
      next: cat => {
        this.toast.exito(`Categoría "${cat.nombre}" ${actual ? 'actualizada' : 'creada'} correctamente`);
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

  async eliminar(cat: CategoriaConConteo) {
    const ok = await this.confirm.preguntar({
      titulo: 'Eliminar categoría',
      mensaje: `¿Seguro que deseas eliminar "${cat.nombre}"? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Sí, eliminar',
      peligro: true,
    });
    if (!ok) return;

    this.categoriaService.eliminar(cat.id).subscribe({
      next: () => {
        this.toast.exito(`Categoría "${cat.nombre}" eliminada`);
        this.cargar();
      },
      // Si tiene cursos, el backend responde 409 con el motivo
      error: err => this.toast.error(mensajeDeError(err), 'No se pudo eliminar'),
    });
  }

  // Ayuda para mostrar errores de validación en el HTML
  invalido(campo: 'nombre' | 'descripcion') {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }
}
