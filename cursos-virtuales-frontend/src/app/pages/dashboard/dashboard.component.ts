import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../core/models/categoria.model';
import { Curso, NIVELES } from '../../core/models/curso.model';
import { Estudiante } from '../../core/models/estudiante.model';
import { ESTADOS, EstadoInscripcion, Inscripcion } from '../../core/models/inscripcion.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { CursoService } from '../../core/services/curso.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { TemaService } from '../../core/services/tema.service';
import { mensajeDeError } from '../../core/utils/error.util';
import { ChartComponent } from '../../shared/components/chart.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { IconComponent } from '../../shared/components/icon.component';

// Lee una variable CSS (así los gráficos usan los mismos colores que el tema)
const css = (nombre: string) => getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();

@Component({
  selector: 'app-dashboard',
  imports: [ChartComponent, IconComponent, EmptyStateComponent, RouterLink, CurrencyPipe, DecimalPipe, DatePipe, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private categoriaService = inject(CategoriaService);
  private cursoService = inject(CursoService);
  private estudianteService = inject(EstudianteService);
  private inscripcionService = inject(InscripcionService);
  private tema = inject(TemaService);

  protected hoy = new Date();

  // ---------- Datos crudos ----------
  protected categorias = signal<Categoria[]>([]);
  protected cursos = signal<Curso[]>([]);
  protected estudiantes = signal<Estudiante[]>([]);
  protected inscripciones = signal<Inscripcion[]>([]);
  protected cargando = signal(true);
  protected errorCarga = signal<string | null>(null);

  constructor() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.errorCarga.set(null);
    forkJoin({
      categorias: this.categoriaService.listar(),
      cursos: this.cursoService.listar(),
      estudiantes: this.estudianteService.listar(),
      inscripciones: this.inscripcionService.listar(),
    }).subscribe({
      next: d => {
        this.categorias.set(d.categorias);
        this.cursos.set(d.cursos);
        this.estudiantes.set(d.estudiantes);
        this.inscripciones.set(d.inscripciones);
        this.cargando.set(false);
      },
      error: err => {
        this.errorCarga.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  // =====================================================================
  // INDICADORES (KPIs) — todo se calcula con computed() a partir de los datos
  // =====================================================================
  protected cursosActivos = computed(() => this.cursos().filter(c => c.activo).length);

  protected inscripcionesVigentes = computed(() => this.inscripciones().filter(i => i.estado !== 'CANCELADA'));

  protected inscripcionesActivas = computed(() => this.inscripciones().filter(i => i.estado === 'ACTIVA').length);

  // Ingresos = suma del precio del curso en cada inscripción no cancelada
  protected ingresos = computed(() => {
    const precios = new Map(this.cursos().map(c => [c.id, c.precio]));
    return this.inscripcionesVigentes().reduce((total, i) => total + (precios.get(i.cursoId) ?? 0), 0);
  });

  // % de inscripciones (no canceladas) que ya se completaron
  protected tasaFinalizacion = computed(() => {
    const vigentes = this.inscripcionesVigentes();
    if (vigentes.length === 0) return 0;
    return (vigentes.filter(i => i.estado === 'COMPLETADA').length / vigentes.length) * 100;
  });

  protected promedioCursosPorEstudiante = computed(() => {
    const est = this.estudiantes().length;
    return est === 0 ? 0 : this.inscripcionesVigentes().length / est;
  });

  // =====================================================================
  // DATOS PARA GRÁFICOS
  // =====================================================================
  protected porEstado = computed(() => {
    const total = this.inscripciones().length;
    const colores: Record<EstadoInscripcion, string> = { ACTIVA: '--series-1', COMPLETADA: '--series-3', CANCELADA: '--series-2' };
    return ESTADOS.map(e => {
      const cantidad = this.inscripciones().filter(i => i.estado === e.valor).length;
      return { ...e, cantidad, porcentaje: total ? (cantidad / total) * 100 : 0, colorVar: colores[e.valor] };
    });
  });

  protected topCursos = computed(() =>
    this.cursos()
      .map(c => ({ titulo: c.titulo, total: this.inscripcionesVigentes().filter(i => i.cursoId === c.id).length }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5),
  );

  protected cursosPorCategoria = computed(() =>
    this.categorias()
      .map(cat => ({ nombre: cat.nombre, total: this.cursos().filter(c => c.categoriaId === cat.id).length }))
      .sort((a, b) => b.total - a.total),
  );

  protected ingresosPorCategoria = computed(() => {
    const cursoPorId = new Map(this.cursos().map(c => [c.id, c]));
    const suma = new Map<string, number>();
    for (const cat of this.categorias()) suma.set(cat.nombre, 0);
    for (const i of this.inscripcionesVigentes()) {
      const curso = cursoPorId.get(i.cursoId);
      if (curso) suma.set(curso.categoriaNombre, (suma.get(curso.categoriaNombre) ?? 0) + curso.precio);
    }
    return [...suma.entries()].map(([nombre, total]) => ({ nombre, total })).sort((a, b) => b.total - a.total);
  });

  protected porNivel = computed(() => {
    const total = this.cursos().length;
    return NIVELES.map(n => {
      const cantidad = this.cursos().filter(c => c.nivel === n.valor).length;
      return { ...n, cantidad, porcentaje: total ? (cantidad / total) * 100 : 0 };
    });
  });

  protected recientes = computed(() =>
    [...this.inscripciones()].sort((a, b) => b.fechaInscripcion.localeCompare(a.fechaInscripcion)).slice(0, 6),
  );

  // =====================================================================
  // CONFIGURACIÓN DE LOS GRÁFICOS (Chart.js)
  // Dependen de tema() → al cambiar a modo oscuro se redibujan con otros colores
  // =====================================================================
  protected graficoEstados = computed<ChartConfiguration<'doughnut'>>(() => {
    this.tema.tema();
    const datos = this.porEstado();
    return {
      type: 'doughnut',
      data: {
        labels: datos.map(d => d.etiqueta),
        datasets: [{
          data: datos.map(d => d.cantidad),
          backgroundColor: datos.map(d => css(d.colorVar)),
          borderColor: css('--surface'),
          borderWidth: 2,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: { legend: { display: false }, tooltip: this.estiloTooltip() },
      },
    };
  });

  protected graficoTopCursos = computed(() => {
    this.tema.tema();
    const datos = this.topCursos();
    return this.barraHorizontal(datos.map(d => d.titulo), datos.map(d => d.total), 'Inscritos', v => `${v}`);
  });

  protected graficoCategorias = computed(() => {
    this.tema.tema();
    const datos = this.cursosPorCategoria();
    return this.barraHorizontal(datos.map(d => d.nombre), datos.map(d => d.total), 'Cursos', v => `${v}`);
  });

  protected graficoIngresos = computed<ChartConfiguration<'bar'>>(() => {
    this.tema.tema();
    const datos = this.ingresosPorCategoria();
    const soles = (v: number) => `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return {
      type: 'bar',
      data: {
        labels: datos.map(d => d.nombre),
        datasets: [{
          label: 'Ingresos',
          data: datos.map(d => d.total),
          backgroundColor: css('--series-1'),
          borderRadius: 4,
          borderSkipped: 'start',
          maxBarThickness: 44,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...this.estiloTooltip(), callbacks: { label: ctx => ` ${soles(ctx.parsed.y ?? 0)}` } },
        },
        scales: {
          x: { grid: { display: false }, border: { color: css('--chart-grid') }, ticks: this.estiloTicks() },
          y: {
            beginAtZero: true,
            grid: { color: css('--chart-grid') },
            border: { display: false },
            ticks: { ...this.estiloTicks(), callback: v => `S/ ${v}` },
          },
        },
      },
    };
  });

  // ---------- Helpers de estilo compartidos ----------
  private barraHorizontal(etiquetas: string[], valores: number[], nombre: string, formato: (v: number) => string): ChartConfiguration<'bar'> {
    return {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: nombre,
          data: valores,
          backgroundColor: css('--series-1'),
          borderRadius: 4,
          borderSkipped: 'start',
          maxBarThickness: 22,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...this.estiloTooltip(), callbacks: { label: ctx => ` ${nombre}: ${formato(ctx.parsed.x ?? 0)}` } },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: css('--chart-grid') },
            border: { display: false },
            ticks: { ...this.estiloTicks(), precision: 0 },
          },
          y: {
            grid: { display: false },
            border: { color: css('--chart-grid') },
            ticks: {
              ...this.estiloTicks(),
              color: css('--text-secondary'),
              callback: function (valor) {
                const texto = this.getLabelForValue(Number(valor));
                return texto.length > 24 ? texto.slice(0, 23) + '…' : texto;
              },
            },
          },
        },
      },
    };
  }

  private estiloTicks() {
    return { color: css('--chart-axis'), font: { family: 'Inter, system-ui, sans-serif', size: 12 } };
  }

  private estiloTooltip() {
    return {
      backgroundColor: css('--text'),
      titleColor: css('--surface'),
      bodyColor: css('--surface'),
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      titleFont: { family: 'Inter, system-ui, sans-serif', weight: 600 as const },
      bodyFont: { family: 'Inter, system-ui, sans-serif' },
    };
  }

  iniciales(nombre: string) {
    return nombre.split(' ').slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase();
  }
}
