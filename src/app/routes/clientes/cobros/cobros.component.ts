/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FacturasService } from 'app/services/facturas.service';
import { ModalEditarCobroComponent } from './modal-editar-cobro/modal-editar-cobro.component';
import { ModalAnularCobroComponent } from './modal-anular-cobro/modal-anular-cobro.component';
import { ModalDescuentoCobroComponent } from './modal-descuento-cobro/modal-descuento-cobro.component';
import { FacturaDto } from 'app/dto/FacturaDto';
import * as moment from 'moment';

@Component({
  selector: 'app-cobros',
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.scss'],
})
export class CobrosComponent implements OnInit {
  displayedColumns: string[] = [
    // 'checkbox',
    'id',
    'cliente',
    'id_contrato',
    'valor',
    'iva',
    'total',
    'saldo',
    'estado',
    'periodo',
    'fecha_emision',
    'fecha_pre_corte',
    'fecha_vencimiento',
    'acciones',
  ];
  dataSource = new MatTableDataSource<FacturaDto>([]);

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
    { id: 'PAGADA', descripcion: 'PAGADAS' },
    { id: 'PENDIENTE', descripcion: 'PENDIENTES' },
    { id: 'ANULADA', descripcion: 'ANULADAS' },
  ];

  statesDisableButtons = ['PAGADA', 'ANULADA'];

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
    private facturaService: FacturasService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.facturaService
      .getAllFacturas(
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
    this.facturaService
      .getAllFacturas(
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

  openEditModal(factura: FacturaDto) {
    const modalEdit = this.dialog.open(ModalEditarCobroComponent, {
      width: '60%',
      height: '90%',
      disableClose: true,
    });
    modalEdit.componentInstance.factura = factura;
    modalEdit.afterClosed().subscribe(() => {
      this.getData();
    });
  }

  openSeeModal(factura: FacturaDto) {
    const modalEdit = this.dialog.open(ModalEditarCobroComponent, {
      width: '60%',
      height: '90%',
    });
    modalEdit.componentInstance.factura = factura;
    modalEdit.componentInstance.watchMode = true;
  }

  // openPrintModal(factura: FacturaDto) {
  //   const modalImprimir = this.dialog.open(ModalImprimirPagoComponent, {
  //     width: '800px',
  //     height: '90%',
  //   });
  //   modalImprimir.componentInstance.factura = factura;
  // }

  openDeleteModal(factura: FacturaDto) {
    const modalAnular = this.dialog.open(ModalAnularCobroComponent, {
      width: '50%',
      disableClose: true,
    });
    modalAnular.componentInstance.factura = factura;
    modalAnular.afterClosed().subscribe(() => {
      this.getData();
    });
  }

  openDiscountModal(factura: FacturaDto) {
    const modalAnular = this.dialog.open(ModalDescuentoCobroComponent, {
      width: '50%',
      disableClose: true,
    });
    modalAnular.componentInstance.factura = factura;
    modalAnular.afterClosed().subscribe(() => {
      this.getData();
    });
  }
}
