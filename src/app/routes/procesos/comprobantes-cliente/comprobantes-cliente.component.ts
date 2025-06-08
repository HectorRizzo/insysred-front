/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ComprobantesService } from 'app/services/comprobantes.service';
import { ArchivoBancoDto } from 'app/dto/ArchivoBancoDto';
import * as moment from 'moment';
import { ComprobanteClienteEditarComponent } from './editar/comprobante-cliente-editar.component';
import { ArchivoMovimientoClienteDto } from 'app/dto/ArchivoMovimientoClienteDto';

@Component({
  selector: 'app-comprobantes-cliente',
  templateUrl: './comprobantes-cliente.component.html',
  styleUrls: ['./comprobantes-cliente.component.scss'],
})
export class ComprobantesClienteComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'cliente',
    'contrato',
    'nombre_original',
    'banco',
    'numero_comprobante',
    'valor_comprobante',
    'fecha_comprobante',
    'aprobacion',
    'estadoConciliacion',
    'fecha_creacion',
    'acciones',
  ];
  dataSource = new MatTableDataSource<ArchivoMovimientoClienteDto>([]);

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  emitionRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  expirationRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  filtroNombre = new FormControl<string>('');

  constructor(
    public dialog: MatDialog,
    private comprobantesService: ComprobantesService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.comprobantesService
      .getAllArchivoMovimientoCliente(
        this.pageIndex,
        this.pageSize,
        this.filtroNombre?.value || '',
        '',
        ''
      )
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.length = res.totalElements;
      });
  }

  clear() {
    this.pageSize = 5;
    this.pageIndex = 0;

    this.emitionRange = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });

    this.expirationRange = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });

    this.filtroNombre.setValue('');
    this.getData();
  }

  applySearchFilters() {
    const { start, end } = this.emitionRange.value;
    const auxFechaIni = start ? moment(start).subtract(5, 'hours').toISOString() : '';
    const auxFechaFin = end ? moment(end).add(18, 'hours').add(59, 'minutes').toISOString() : '';
    this.pageIndex = 0;
    this.comprobantesService
      .getAllArchivoMovimientoCliente(
        this.pageIndex,
        this.pageSize,
        this.filtroNombre?.value || '',
        auxFechaIni,
        auxFechaFin
      )
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.length = res.totalElements;
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openSeeModal(archivo: ArchivoMovimientoClienteDto) {
    const ref = this.dialog.open(ComprobanteClienteEditarComponent, {
      maxWidth: '95vw',
      width: '95vw',
      height: '95%',
    });
    ref.componentInstance.archivo = archivo;
    ref.afterClosed().subscribe(() => {
      this.getData();
    });
  }
}
