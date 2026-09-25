import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-toast-container',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-stack" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="'toast toast--' + t.tipo">
          <app-icon [name]="t.tipo === 'exito' ? 'check-circle' : t.tipo === 'error' ? 'alert' : 'info'" [size]="20" />
          <div class="toast-text">
            <strong>{{ t.titulo }}</strong>
            <span>{{ t.mensaje }}</span>
          </div>
          <button class="btn-icon btn-icon--sm" (click)="toast.cerrar(t.id)" aria-label="Cerrar">
            <app-icon name="x" [size]="14" />
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  protected toast = inject(ToastService);
}
