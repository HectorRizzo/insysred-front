import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReciboDto } from 'app/dto/ReciboDto';

@Component({
  selector: 'app-modal-imprimir-pago',
  templateUrl: './modal-imprimir-pago.component.html',
  styleUrls: ['./modal-imprimir-pago.component.scss'],
})
export class ModalImprimirPagoComponent {
  @Input() recibo: ReciboDto;
  @Input() resp: any = null;
  @Input() url: any = null;

  constructor(public dialogRef: MatDialogRef<ModalImprimirPagoComponent>) {}

  descargar() {
    const contentDisposition = this.resp.headers.get('content-disposition');
    let nombreArchivo = '';
    if (contentDisposition && contentDisposition.split(';')[1].includes('filename')) {
      nombreArchivo = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
      console.log(nombreArchivo);
    } else {
      nombreArchivo = `reporte_recibo_${this.recibo.id}.pdf`;
    }
    const downloadURL = window.URL.createObjectURL(
      new Blob([this.resp.body], { type: 'aplication/pdf' })
    );
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = nombreArchivo;
    link.click();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
