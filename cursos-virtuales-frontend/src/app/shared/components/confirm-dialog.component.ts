import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmService } from '../../core/services/confirm.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (confirm.actual(); as op) {
      <div class="modal-backdrop" (click)="confirm.responder(false)"></div>
      <div class="modal confirm" role="alertdialog" aria-modal="true" style="max-width: 420px">
        <div class="confirm-icon" [class.confirm-icon--danger]="op.peligro">
          <app-icon [name]="op.peligro ? 'trash' : 'info'" [size]="22" />
        </div>
        <h2>{{ op.titulo }}</h2>
        <p>{{ op.mensaje }}</p>
        <div class="confirm-actions">
          <button class="btn btn-ghost" (click)="confirm.responder(false)">Cancelar</button>
          <button class="btn" [class.btn-danger]="op.peligro" [class.btn-primary]="!op.peligro"
                  (click)="confirm.responder(true)">
            {{ op.textoConfirmar ?? 'Confirmar' }}
          </button>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  protected confirm = inject(ConfirmService);
}
