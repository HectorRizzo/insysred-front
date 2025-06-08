import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-warning',
  templateUrl: './modal-warning.component.html',
  styleUrls: ['./modal-warning.component.scss'],
})
export class ModalWarningComponent implements OnDestroy {
  loading: boolean;
  emitido: boolean = false;

  @Input() mensaje: string;
  @Input() mensaje2: string;
  @Input() muestraBotonAceptar = true;
  @Input() muestraBotonCancelar = true;
  @Input() muestraBotonCerrar = true;
  @Input() labelButtonLeft = '';
  @Input() labelButtonRight = '';

  @Output() respuesta: EventEmitter<boolean> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<ModalWarningComponent>) {}

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
