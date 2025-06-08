import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnDestroy {
  loading: boolean;
  emitido: boolean = false;

  @Input() mensaje: string;
  @Input() mensaje2: string;
  @Input() muestraBotonAceptar = true;
  @Input() muestraBotonCancelar = true;
  @Input() muestraBotonCerrar = true;
  @Input() labelButtonLeft = '';
  @Input() labelButtonRight = '';
  @Input() titulo = 'Información';

  @Output() respuesta: EventEmitter<boolean> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<ModalInfoComponent>) {}

  ngOnDestroy(): void {
    if (!this.emitido) this.respuesta.emit(false);
  }

  closeModal() {
    this.emitido = true;
    this.dialogRef.close();
  }

  emitirAccion(opt: boolean) {
    this.emitido = true;
    this.respuesta.emit(opt);
    this.closeModal();
  }
}
