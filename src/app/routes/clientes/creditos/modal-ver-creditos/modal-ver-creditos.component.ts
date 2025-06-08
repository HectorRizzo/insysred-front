import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreditoDto } from 'app/dto/CreditoDto';
import { CreditoXFacturaDto } from 'app/dto/CreditoXFacturaDto';
import { CreditosService } from 'app/services/creditos.service';

@Component({
  selector: 'app-modal-ver-creditos',
  templateUrl: './modal-ver-creditos.component.html',
  styleUrls: ['./modal-ver-creditos.component.scss'],
})
export class ModalVerCreditosComponent implements OnInit {
  @Input() credito: CreditoDto;

  displayedColumnsDetalle: string[] = ['id', 'id_factura', 'valor_aplicado', 'fecha_creacion'];
  dataSourceDetalle = new MatTableDataSource<CreditoXFacturaDto>([]);

  constructor(
    public dialogRef: MatDialogRef<ModalVerCreditosComponent>,
    private creditosService: CreditosService
  ) {}

  ngOnInit(): void {
    this.getCredito();
  }

  getCredito() {
    this.creditosService.getCredito(this.credito.id).subscribe({
      next: res => {
        this.dataSourceDetalle = new MatTableDataSource(
          res.creditoXFactura.sort((a, b) => a.id - b.id)
        );
      },
      error: error => {},
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
