// checkbox.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modulos-check',
  templateUrl: './modulos-check.component.html',
  styleUrls: ['./modulos-check.component.css']
})
export class ModulosCheckComponent {
  @Input() data: any;
  @Output() cambio = new EventEmitter<any>();

  checkModulo(item: any) {
    console.log(item);
    this.cambio.emit(item);
  }
}