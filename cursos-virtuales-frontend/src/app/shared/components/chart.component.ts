import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

// Envoltorio de Chart.js: recibe una configuración y dibuja el gráfico.
// Si la configuración cambia (nuevos datos o cambio de tema), lo vuelve a dibujar.
@Component({
  selector: 'app-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-box" [style.height.px]="alto()">
      <canvas #lienzo role="img" [attr.aria-label]="etiqueta()"></canvas>
    </div>
  `,
  styles: `.chart-box { position: relative; width: 100%; }`,
})
export class ChartComponent implements OnDestroy {
  config = input.required<ChartConfiguration<any>>();
  alto = input(260);
  etiqueta = input('Gráfico');

  private lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');
  private grafico?: Chart;

  constructor() {
    effect(() => {
      const config = this.config();
      const canvas = this.lienzo().nativeElement;
      this.grafico?.destroy();
      this.grafico = new Chart(canvas, config);
    });
  }

  ngOnDestroy() {
    this.grafico?.destroy();
  }
}
