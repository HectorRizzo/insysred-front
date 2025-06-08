/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BancosService } from 'app/services/bancos.service';
import { ArchivoBancoDto } from 'app/dto/ArchivoBancoDto';
import { CargarBancoVerComponent } from './ver/cargar-banco-ver.component';
import { CargarBancoNuevoComponent } from './nuevo/cargar-banco-nuevo.component';
import * as moment from 'moment';

@Component({
  selector: 'app-cargar-banco',
  templateUrl: './cargar-banco.component.html',
  styleUrls: ['./cargar-banco.component.scss'],
})
export class CargarBancoComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nombre',
    'banco',
    'registros_exitos',
    'registros_errores',
    'registros_repetidos',
    'registros_total',
    'estado',
    'fecha_inicio',
    'fecha_fin',
    'acciones',
  ];
  dataSource = new MatTableDataSource<ArchivoBancoDto>([]);

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
    private bancosService: BancosService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.bancosService
      .getAllConciliacion(this.pageIndex, this.pageSize, this.filtroNombre?.value || '', '', '')
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
    this.bancosService
      .getAllConciliacion(
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

  openNewForm() {
    const ref = this.dialog.open(CargarBancoNuevoComponent, {
      width: '30%',
    });
    ref.afterClosed().subscribe(() => {
      this.getData();
    });
  }

  openSeeModal(archivoConciliacion: ArchivoBancoDto) {
    const ref = this.dialog.open(CargarBancoVerComponent, {
      width: '60%',
      height: '90%',
    });
    ref.componentInstance.archivoConciliacion = archivoConciliacion;
  }
}