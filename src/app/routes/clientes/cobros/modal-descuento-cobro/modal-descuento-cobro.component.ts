import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AplicarDescuentoFacturaDto } from 'app/dto/AplicarDescuentoFacturaDto';
import { FacturaDto } from 'app/dto/FacturaDto';
import { FacturasService } from 'app/services/facturas.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';

@Component({
  selector: 'app-modal-descuento-cobro',
  templateUrl: './modal-descuento-cobro.component.html',
  styleUrls: ['./modal-descuento-cobro.component.scss'],
})
export class ModalDescuentoCobroComponent implements OnInit {
  @Input() factura: FacturaDto;

  nuevoSaldo: number;
  valorDescuento: number;
  motivoDescuento: string;

  constructor(
    public dialogRef: MatDialogRef<ModalDescuentoCobroComponent>,
    private toast: ToastService,
    private facturaService: FacturasService
  ) {}

  ngOnInit(): void {
    this.nuevoSaldo = this.factura.saldo;
  }

  ngModelChangeDescuento() {
    this.nuevoSaldo = Number((this.factura.saldo - this.valorDescuento).toFixed(2));
  }

  aplicarDescuento() {
    const body: AplicarDescuentoFacturaDto = {
      idFactura: this.factura.id,
      valor: this.valorDescuento,
      justificacion: this.motivoDescuento,
    };
    if (
      !this.motivoDescuento ||
      this.valorDescuento > this.factura.total ||
      this.valorDescuento < 0.01
    ) {
      return;
    }
    this.facturaService.postAplicarDescuentoFactura(body).subscribe(res => {
      this.toast.showMessage('Descuento aplicado con éxito', MessageType.SUCCESS);
      this.closeModal();
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
