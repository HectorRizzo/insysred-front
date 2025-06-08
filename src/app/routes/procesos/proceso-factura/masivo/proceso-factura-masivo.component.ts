import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PeriodoService } from 'app/services/periodo.service';
import { PeriodoDto } from 'app/dto/PeriodoDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcesarPeriodoResultadoDto } from 'app/dto/ProcesarPeriodoResultadoDto';
import { MatDialog } from '@angular/material/dialog';
import { ProcesoFacturaResumenComponent } from '../resumen/proceso-factura-resumen.component';

@Component({
  selector: 'app-proceso-factura-masivo',
  templateUrl: './proceso-factura-masivo.component.html',
  styleUrls: ['./proceso-factura-masivo.component.scss'],
})
export class ProcesoFacturaMasivoComponent {
  @Input() periodos: PeriodoDto[];
  @Output() actualizar: EventEmitter<boolean> = new EventEmitter<boolean>();

  displayedColumns: string[] = ['periodo', 'fechaRango', 'estadoPeriodo', 'acciones'];

  disabled = false;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private periodoService: PeriodoService
  ) {}

  procesar(periodo: PeriodoDto) {
    this.periodoService.getProcesar(periodo.id).subscribe({
      next: resumen => {
        this.openSnackBar('Éxito en el proceso masivo.');
        this.verResumen(periodo, resumen);
        this.actualizar.emit(true);
      },
      error: error => {
        console.log('Error:', error);
      },
    });
  }

  verResumen(periodo: PeriodoDto, resumen: ProcesarPeriodoResultadoDto) {
    const modalAnular = this.dialog.open(ProcesoFacturaResumenComponent, {
      width: '50%',
      disableClose: true,
    });
    modalAnular.componentInstance.resumen = resumen;
    modalAnular.componentInstance.periodo = periodo;
  }

  openSnackBar(message: string, actions: string | undefined = undefined) {
    this.snackBar.open(message, actions, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
