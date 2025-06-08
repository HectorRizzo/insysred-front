import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeriodoDto } from 'app/dto/PeriodoDto';
import { ProcesarPeriodoResultadoDto } from 'app/dto/ProcesarPeriodoResultadoDto';

@Component({
  selector: 'app-proceso-factura-resumen',
  templateUrl: './proceso-factura-resumen.component.html',
  styleUrls: ['./proceso-factura-resumen.component.scss'],
})
export class ProcesoFacturaResumenComponent {
  @Input() resumen: ProcesarPeriodoResultadoDto;
  @Input() periodo: PeriodoDto;

  constructor(public dialogRef: MatDialogRef<ProcesoFacturaResumenComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
