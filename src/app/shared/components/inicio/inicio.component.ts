import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InicioComponent {
  @Input() code = '';
  @Input() title = '';
  @Input() message = '';
}
