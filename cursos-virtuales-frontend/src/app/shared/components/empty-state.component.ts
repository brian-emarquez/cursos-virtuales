import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-empty-state',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <div class="empty-icon"><app-icon [name]="icono()" [size]="26" /></div>
      <h3>{{ titulo() }}</h3>
      <p>{{ mensaje() }}</p>
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  icono = input('inbox');
  titulo = input('Sin resultados');
  mensaje = input('');
}
