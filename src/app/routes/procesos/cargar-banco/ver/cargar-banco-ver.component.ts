import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BancosService } from 'app/services/bancos.service';
import {
  ArchivoBancoDto,
  DetalleArchivoBancoDto,
  DetalleErrorArchivoBancoDto,
} from 'app/dto/ArchivoBancoDto';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cargar-banco-ver',
  templateUrl: './cargar-banco-ver.component.html',
  styleUrls: ['./cargar-banco-ver.component.scss'],
})
export class CargarBancoVerComponent implements OnInit {
  @Input() archivoConciliacion: ArchivoBancoDto;

  displayedColumnsDetalle: string[] = ['fecha', 'documento', 'valor', 'referencia'];
  dataSourceDetalle = new MatTableDataSource<DetalleArchivoBancoDto>([]);

  displayedColumnsDetalleError: string[] = ['fecha', 'documento', 'valor', 'referencia', 'mensaje'];
  dataSourceDetalleError = new MatTableDataSource<DetalleErrorArchivoBancoDto>([]);

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<CargarBancoVerComponent>,
    private bancosService: BancosService
  ) {}

  ngOnInit(): void {
    this.getFactura();
  }

  getFactura() {
    this.bancosService.getConciliacion(this.archivoConciliacion.id).subscribe({
      next: archivo => {
        this.dataSourceDetalle = new MatTableDataSource(archivo.detalleArchivoConciliacion);
        this.dataSourceDetalle.paginator = this.paginator;

        this.dataSourceDetalleError = new MatTableDataSource(
          archivo.detalleErrorArchivoConciliacion
        );
      },
      error: error => {},
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
