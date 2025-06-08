import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { ArchivoMovimientoClienteDto } from 'app/dto/ArchivoMovimientoClienteDto';
import { ConciliarArchivoMovimientoClienteDto } from 'app/dto/ConciliarArchivoMovimientoClienteDto';
import { DetalleArchivoMovimientoClienteDto } from 'app/dto/DetalleArchivoMovimientoClienteDto';
import { ExistenciaMovClienteXMovBancoDto } from 'app/dto/ExistenciaMovClienteXMovBancoDto';
import { TipoBancoDto } from 'app/dto/TipoBancoDto';
import { BancosService } from 'app/services/bancos.service';
import { ComprobantesService } from 'app/services/comprobantes.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-comprobante-cliente-editar',
  templateUrl: './comprobante-cliente-editar.component.html',
  styleUrls: ['./comprobante-cliente-editar.component.scss'],
})
export class ComprobanteClienteEditarComponent implements OnInit {
  @Input() archivo: ArchivoMovimientoClienteDto;
  detalle?: DetalleArchivoMovimientoClienteDto;
  tipoBanco: TipoBancoDto[] = [];

  existenciaMovClienteXMovBanco: ExistenciaMovClienteXMovBancoDto | null;
  repetido: boolean = false;
  anular: boolean = false;

  editInvoice: FormGroup;

  disableBtn = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ComprobanteClienteEditarComponent>,
    private comprobantesService: ComprobantesService,
    private bancosService: BancosService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.getAllTipoBanco();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getDetalle();
  }

  buildForm() {
    this.editInvoice = this.fb.nonNullable.group({
      idBanco: [null],
      numeroComprobante: [{ value: null, disabled: true }, [Validators.required]],
      fechaComprobante: [null, [Validators.required]],
      valorComprobante: [null, [Validators.required]],
      aprobacion: [true, [Validators.required]],
    });
  }

  getDetalle() {
    this.comprobantesService.getArchivoMovimientoClienteId(this.archivo.id).subscribe({
      next: resp => {
        this.detalle = resp;

        if (this.detalle?.estadoConciliacion === 'NCO') {
          this.editInvoice.controls.idBanco.enable();
          this.editInvoice.controls.numeroComprobante.enable();
          this.editInvoice.controls.fechaComprobante.enable();
          this.editInvoice.controls.valorComprobante.enable();
          this.editInvoice.controls.aprobacion.enable();
        } else {
          this.editInvoice.controls.idBanco.disable();
          this.editInvoice.controls.numeroComprobante.disable();
          this.editInvoice.controls.fechaComprobante.disable();
          this.editInvoice.controls.valorComprobante.disable();
          this.editInvoice.controls.aprobacion.disable();
        }

        this.editInvoice.controls.idBanco.setValue(this.detalle?.banco?.id);
        this.editInvoice.controls.numeroComprobante.setValue(this.detalle?.numeroComprobante);
        this.editInvoice.controls.fechaComprobante.setValue(this.detalle?.fechaComprobante);
        this.editInvoice.controls.valorComprobante.setValue(this.detalle?.valorComprobante);
        this.editInvoice.controls.aprobacion.setValue(this.detalle?.aprobacion);
      },
      error: error => {},
    });
  }

  getAllTipoBanco() {
    this.bancosService.getAllTipoBanco().subscribe({
      next: tipos => {
        this.tipoBanco = tipos;
      },
      error: error => {},
    });
  }

  async validar() {
    const { numeroComprobante } = this.editInvoice.value;
    this.repetido = false;
    this.anular = false;
    if (numeroComprobante) {
      try {
        const req = this.comprobantesService.getValidarNumeroComprobante(numeroComprobante);
        const res = await lastValueFrom(req);
        this.existenciaMovClienteXMovBanco = res;
        const idMovCliente = this.existenciaMovClienteXMovBanco.idMovCliente;
        this.repetido = idMovCliente !== null && idMovCliente !== this.detalle?.id;
      } catch (error: any) {
        console.log('Error:', error);
      }
    }
  }

  conciliar() {
    if (['CCO', 'CMA'].includes(this.archivo.estadoConciliacion)) {
      return;
    }
    const { idBanco, numeroComprobante, fechaComprobante, valorComprobante, aprobacion } =
      this.editInvoice.value;

    const validarArchivoMovimientoClienteDto: ConciliarArchivoMovimientoClienteDto = {
      idArchivo: this.archivo.id,
      idBanco,
      numeroComprobante:
        this.detalle?.estadoConciliacion !== 'NCO'
          ? this.detalle?.numeroComprobante
          : numeroComprobante,
      fechaComprobante,
      valorComprobante,
      aprobacion,
      idConMovClienteXMovBanco: this.existenciaMovClienteXMovBanco?.idMovClienteXMovBanco,
      idConMovCliente: this.existenciaMovClienteXMovBanco?.idMovCliente,
      idConMovBanco: this.existenciaMovClienteXMovBanco?.idMovBanco,
      anular: this.anular,
    };
    this.disableBtn = true;
    this.comprobantesService
      .postConciliarComprobante(validarArchivoMovimientoClienteDto)
      .subscribe({
        next: resp => {
          this.detalle = resp;

          if (this.detalle?.estadoConciliacion === 'NCO') {
            this.editInvoice.controls.idBanco.enable();
            this.editInvoice.controls.numeroComprobante.enable();
            this.editInvoice.controls.fechaComprobante.enable();
            this.editInvoice.controls.valorComprobante.enable();
            this.editInvoice.controls.aprobacion.enable();
          } else {
            this.editInvoice.controls.idBanco.disable();
            this.editInvoice.controls.numeroComprobante.disable();
            this.editInvoice.controls.fechaComprobante.disable();
            this.editInvoice.controls.valorComprobante.disable();
            this.editInvoice.controls.aprobacion.disable();
          }

          this.editInvoice.controls.idBanco.setValue(this.detalle?.banco?.id);
          this.editInvoice.controls.numeroComprobante.setValue(this.detalle?.numeroComprobante);
          this.editInvoice.controls.fechaComprobante.setValue(this.detalle?.fechaComprobante);
          this.editInvoice.controls.valorComprobante.setValue(this.detalle?.valorComprobante);
          this.editInvoice.controls.aprobacion.setValue(this.detalle?.aprobacion);

          this.openSnackBar('Éxito en la conciliación.');
          this.disableBtn = false;

          this.closeModal();
        },
        error: error => {
          this.disableBtn = false;
          console.log('Error:', error);
        },
      });
  }

  async guardar() {
    await this.validar();
    if (this.repetido) {
      this.conciliarRepetido();
    } else {
      this.conciliar();
    }
  }

  conciliarRepetido() {
    if (['CCO', 'CMA'].includes(this.archivo.estadoConciliacion)) {
      return;
    }
    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto',
    });
    modalWarning.componentInstance.mensaje =
      'El número de comprobante ya fue registrado.<br>¿Desea anular el registro actual?';
    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';
    modalWarning.componentInstance.respuesta.subscribe((respuesta: boolean) => {
      this.anular = respuesta;
      this.conciliar();
    });
  }

  openSnackBar(message: string, actions: string | undefined = undefined) {
    this._snackBar.open(message, actions, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
