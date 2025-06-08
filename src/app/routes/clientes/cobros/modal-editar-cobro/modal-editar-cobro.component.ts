/* eslint-disable max-len */
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacturasService } from 'app/services/facturas.service';
import { FacturaDto } from 'app/dto/FacturaDto';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleFacturaDto } from 'app/dto/DetalleFacturaDto';
import { CambioEstadoFacturaDto } from 'app/dto/CambioEstadoFacturaDto';
import { FacturaPromesaPagoDto } from 'app/dto/FacturaPromesaPagoDto';
import { ReciboDto } from 'app/dto/ReciboDto';
import { MatSelectChange } from '@angular/material/select';
import { ModalImprimirPagoComponent } from '../modal-imprimir-pago/modal-imprimir-pago.component';
import { DescuentoFacturaDto } from 'app/dto/DescuentoFacturaDto';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { BancosService } from 'app/services/bancos.service';
import { TipoBancoDto } from 'app/dto/TipoBancoDto';

@Component({
  selector: 'app-modal-editar-cobro',
  templateUrl: './modal-editar-cobro.component.html',
  styleUrls: ['./modal-editar-cobro.component.scss'],
})
export class ModalEditarCobroComponent implements OnInit {
  @Input() factura: FacturaDto;
  @Input() watchMode = false;

  displayedColumnsDetalle: string[] = ['id', 'rubro', 'tipo_rubro', 'cantidad', 'valor'];
  dataSourceDetalle = new MatTableDataSource<DetalleFacturaDto>([]);

  displayedColumnsPromesaPago: string[] = ['id', 'fecha'];
  dataSourcePromesaPago = new MatTableDataSource<FacturaPromesaPagoDto>([]);

  displayedColumnsRecibo: string[] = ['id', 'fecha', 'tipo', 'forma', 'banco', 'valor', 'accion'];
  dataSourceRecibo = new MatTableDataSource<ReciboDto>([]);

  displayedColumnsDescuento: string[] = ['id', 'valor', 'justificacion'];
  dataSourceDescuento = new MatTableDataSource<DescuentoFacturaDto>([]);

  editInvoice: FormGroup;

  disableBtn = false;

  tiposEstado = [
    { id: 'PAGADA', descripcion: 'PAGADA' },
    { id: 'PENDIENTE', descripcion: 'PENDIENTE' },
  ];

  formaPago = [
    { id: 'EFECTIVO', descripcion: 'EFECTIVO' },
    { id: 'TRANSFERENCIA', descripcion: 'TRANSFERENCIA' },
  ];

  tiposPago = [
    { id: 'TOTAL', descripcion: 'TOTAL' },
    { id: 'ABONO', descripcion: 'ABONO' },
  ];

  saldoFactura: number;

  tipoBanco: TipoBancoDto[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalEditarCobroComponent>,
    private fb: FormBuilder,
    private toast: ToastService,
    private facturaService: FacturasService,
    private bancosService: BancosService
  ) {}

  ngOnInit(): void {
    this.saldoFactura = this.factura.saldo;
    this.getAllTipoBanco();
    this.buildForm();
    this.getFactura();
  }

  getAllTipoBanco() {
    this.bancosService.getAllTipoBanco().subscribe({
      next: tipos => {
        this.tipoBanco = tipos;
      },
      error: error => {},
    });
  }

  getFactura() {
    this.facturaService.getFactura(this.factura.id).subscribe({
      next: res => {
        this.buildDataSource(res);
      },
      error: error => {},
    });
  }

  buildDataSource(factura: FacturaDto) {
    this.dataSourceDetalle = new MatTableDataSource(
      factura.detalleFacturas.sort((a, b) => a.id - b.id)
    );
    this.dataSourcePromesaPago = new MatTableDataSource(
      factura.promesasPago.sort((a, b) => a.id - b.id)
    );
    this.dataSourceDescuento = new MatTableDataSource(
      factura.descuentosFactura.sort((a, b) => a.id - b.id)
    );
    this.dataSourceRecibo = new MatTableDataSource(factura.recibos.sort((a, b) => a.id - b.id));
  }

  buildForm() {
    this.editInvoice = this.fb.nonNullable.group({
      saldo: [this.factura.saldo, [Validators.required]],
      estado: [this.factura.estado, [Validators.required]],
      tipoPago: ['', [Validators.required]],
      formaPago: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0)]],

      idBanco: [''],
      numeroComprobante: [''],
      fechaComprobante: [''],

      fechaPromesaPago: [''],
    });
    this.valueChanges();
  }

  editarCobro() {
    const {
      saldo,
      estado,
      tipoPago,
      formaPago,
      valor,
      fechaPromesaPago,
      idBanco,
      numeroComprobante,
      fechaComprobante,
    } = this.editInvoice.value;
    const cambioEstadoFactura: CambioEstadoFacturaDto = {
      idFactura: this.factura.id,
      estado,
      saldo,
      formaPago,
      tipoPago,
      valor,
      idBanco,
      numeroComprobante,
      fechaComprobante,
      fechaPromesaPago:
        fechaPromesaPago && fechaPromesaPago !== '' ? fechaPromesaPago.toDate() : null,
    };
    if (valor <= 0) {
      this.toast.showMessage('El valor del pago no puede ser $0', MessageType.ERROR);
      return;
    }
    this.disableBtn = true;
    this.facturaService.postCambiarEstadoFactura(cambioEstadoFactura).subscribe({
      next: res => {
        this.toast.showMessage('Pago realizado con éxito', MessageType.SUCCESS);
        this.buildDataSource(res);
        const length = res.recibos.length;
        const ultimoRecibo = res.recibos[length - 1];
        this.openPrintModal(ultimoRecibo, true);
        // this.closeModal();
        this.disableBtn = false;
      },
      error: error => {
        this.disableBtn = false;
        console.log('this.facturaService.postCambiarEstadoFactura ~ error:', error);
      },
    });
  }

  selectionChangeTipoPago(event: MatSelectChange) {
    if (event.value === 'TOTAL') {
      this.editInvoice.controls.estado.setValue('PAGADA');
      this.editInvoice.controls.valor.setValue(this.factura.saldo);
      this.editInvoice.controls.fechaPromesaPago.clearValidators();
    } else if (event.value === 'ABONO') {
      this.editInvoice.controls.estado.setValue('PENDIENTE');
      this.editInvoice.controls.valor.setValue(1);
      this.editInvoice.controls.fechaPromesaPago.setValidators(Validators.required);
    }
  }

  valueChanges() {
    // this.editInvoice.valueChanges.subscribe(value => {});
    this.editInvoice.controls.valor.valueChanges.subscribe(value => {
      const calc = Math.round((this.saldoFactura - value) * 100) / 100;
      this.editInvoice.controls.saldo.setValue(calc);
      if (this.editInvoice.value.valor == this.factura.saldo) {
        this.editInvoice.controls.estado.setValue('PAGADA');
        this.editInvoice.controls.tipoPago.setValue('TOTAL');
      } else {
        this.editInvoice.controls.estado.setValue('PENDIENTE');
        this.editInvoice.controls.tipoPago.setValue('ABONO');
      }
    });
    this.editInvoice.controls.formaPago.valueChanges.subscribe(value => {
      if (value === this.formaPago[0].descripcion) {
        this.editInvoice.controls.idBanco.setValue(null);
        this.editInvoice.controls.fechaPromesaPago.setValue(null);
        this.editInvoice.controls.numeroComprobante.setValue(null);
        this.editInvoice.controls.fechaComprobante.setValue(null);
      }
    });
    this.editInvoice.controls.tipoPago.valueChanges.subscribe(value => {
      if (value === this.tiposPago[1].descripcion) {
        this.editInvoice.controls.fechaPromesaPago.setValue(null);
      }
    });
  }

  openPrintModal(recibo: ReciboDto, cerrarModalPadre: boolean = false) {
    let url: string;
    this.facturaService.getReporteRecibo(recibo.id).subscribe({
      next: resp => {
        const pdf = resp.body;
        if (pdf.size > 0) {
          const blob = new Blob([pdf], { type: 'aplication/pdf' });
          url = URL.createObjectURL(blob);

          const modalImprimir = this.dialog.open(ModalImprimirPagoComponent, {
            width: '800px',
            height: '90%',
          });
          modalImprimir.componentInstance.recibo = recibo;
          modalImprimir.componentInstance.resp = resp;
          modalImprimir.componentInstance.url = url;
          if (cerrarModalPadre) {
            this.closeModal();
          }
        }
      },
      error: error => {},
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
