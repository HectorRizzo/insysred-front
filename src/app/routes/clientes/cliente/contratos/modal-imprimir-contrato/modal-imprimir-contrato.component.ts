import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-imprimir-contrato',
  templateUrl: './modal-imprimir-contrato.component.html',
  styleUrls: ['./modal-imprimir-contrato.component.scss']
})
export class ModalImprimirContratoComponent {

  @Input() contrato: any;
  @Input() cliente: any;

  urlCabecera = './assets/images/INSYSRED_CABECERA.png';

  constructor(
    public dialogRef: MatDialogRef<ModalImprimirContratoComponent>
  ){}

  async descargarPdf(){
    const data1: HTMLElement = document.getElementById('page1')!;
    const data2: HTMLElement = document.getElementById('page2')!;
    const data3: HTMLElement = document.getElementById('page3')!;

    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    const imgWidth = 208;
    const position = 0;

    const canvas1 = await html2canvas(data1);
    const imgHeight = canvas1.height * imgWidth / canvas1.width;
    const contentDataURL = canvas1.toDataURL('image/png');
    pdf.addImage(contentDataURL, 'PNG', 5, position + 5, imgWidth - 10, imgHeight);
    pdf.addPage();

    const canvas2 = await html2canvas(data2);
    const imgHeight2 = canvas2.height * imgWidth / canvas2.width;
    const contentDataURL2 = canvas2.toDataURL('image/png');
    pdf.addImage(contentDataURL2, 'PNG', 5, position + 5, imgWidth - 10, imgHeight2);
    pdf.addPage();

    const canvas3 = await html2canvas(data3);
    const imgHeight3 = canvas3.height * imgWidth / canvas3.width;
    const contentDataURL3 = canvas3.toDataURL('image/png');
    pdf.addImage(contentDataURL3, 'PNG', 5, position + 5, imgWidth -10, imgHeight3);
    
    pdf.save('contrato.pdf'); // Generated PDF
    
  }

  cerrarPrevisualizacion(){
    this.dialogRef.close();
  }


}
