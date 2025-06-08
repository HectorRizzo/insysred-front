import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AnularFacturaDto } from 'app/dto/AnularFacturaDto';
import { FacturaDto } from 'app/dto/FacturaDto';
import { FacturasService } from 'app/services/facturas.service';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';

@Component({
  selector: 'app-modal-anular-cobro',
  templateUrl: './modal-anular-cobro.component.html',
  styleUrls: ['./modal-anular-cobro.component.scss'],
})
export class ModalAnularCobroComponent {
  @Input() factura: FacturaDto;

  motivoAnulacion: string;

  constructor(
    public dialogRef: MatDialogRef<ModalAnularCobroComponent>,
    private toast: ToastService,
    private facturaService: FacturasService
  ) {}

  anularFactura() {
    const body: AnularFacturaDto = {
      idFactura: this.factura.id,
      justificacion: this.motivoAnulacion,
    };
    this.facturaService.postAnularFactura(body).subscribe(res => {
      this.toast.showMessage('Rubro anulado con éxito', MessageType.SUCCESS);
      this.closeModal();
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
