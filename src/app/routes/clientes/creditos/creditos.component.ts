/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreditoDto } from 'app/dto/CreditoDto';
import { CreditosService } from 'app/services/creditos.service';
import { FacturasService } from 'app/services/facturas.service';
import * as moment from 'moment';
import { ModalVerCreditosComponent } from './modal-ver-creditos/modal-ver-creditos.component';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss'],
})
export class CreditosComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'id_contrato',
    'cliente',
    'valor_credito',
    'saldo',
    'estado_credito',
    'fecha_credito',
    'acciones',
  ];
  dataSource = new MatTableDataSource<CreditoDto>([]);

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  tiposEstado = [
    { id: '', descripcion: 'TODOS' },
    { id: 'VIGENTE', descripcion: 'VIGENTE' },
    { id: 'APLICADO', descripcion: 'APLICADO' },
  ];

  emitionRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  expirationRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  filtroCliente = new FormControl<string>('');
  filtroEstado = new FormControl<string>('');

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

    this.filtroCliente.setValue('');
    this.filtroEstado.setValue('');

    this.getData();
  }

  constructor(
    public dialog: MatDialog,
    private creditosService: CreditosService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.creditosService
      .getAllCreditos(
        this.pageIndex,
        this.pageSize,
        this.filtroCliente?.value || '',
        this.filtroEstado?.value || '',
        '',
        ''
      )
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res.content);
        this.length = res.totalElements;
      });
  }

  applySearchFilters() {
    const { start, end } = this.emitionRange.value;
    const auxFechaIni = start ? moment(start).subtract(5, 'hours').toISOString() : '';
    const auxFechaFin = end ? moment(end).add(18, 'hours').add(59, 'minutes').toISOString() : '';
    this.pageIndex = 0;
    this.creditosService
      .getAllCreditos(
        this.pageIndex,
        this.pageSize,
        this.filtroCliente?.value || '',
        this.filtroEstado?.value || '',
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

  openSeeModal(credito: CreditoDto) {
    const modalEdit = this.dialog.open(ModalVerCreditosComponent, {
      width: '60%',
      height: '90%',
      disableClose: true,
    });
    modalEdit.componentInstance.credito = credito;
  }
}
