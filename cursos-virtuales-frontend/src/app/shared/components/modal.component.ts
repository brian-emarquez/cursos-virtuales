import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { IconComponent } from './icon.component';

// Ventana modal reutilizable. Uso:
// <app-modal [abierto]="x()" titulo="..." (cerrar)="...">
//   contenido...
//   <div modal-footer> botones </div>
// </app-modal>
@Component({
  selector: 'app-modal',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (abierto()) {
      <div class="modal-backdrop" (click)="cerrar.emit()"></div>
      <div class="modal" role="dialog" aria-modal="true" [style.max-width.px]="ancho()">
        <header class="modal-header">
          <div>
            <h2>{{ titulo() }}</h2>
            @if (subtitulo()) { <p>{{ subtitulo() }}</p> }
          </div>
          <button class="btn-icon" type="button" (click)="cerrar.emit()" aria-label="Cerrar">
            <app-icon name="x" />
          </button>
        </header>
        <div class="modal-body"><ng-content /></div>
        <footer class="modal-footer"><ng-content select="[modal-footer]" /></footer>
      </div>
    }
  `,
})
export class ModalComponent {
  abierto = input(false);
  titulo = input('');
  subtitulo = input('');
  ancho = input(560);
  cerrar = output<void>();

  @HostListener('document:keydown.escape')
  alPresionarEscape() {
    if (this.abierto()) this.cerrar.emit();
  }
}
