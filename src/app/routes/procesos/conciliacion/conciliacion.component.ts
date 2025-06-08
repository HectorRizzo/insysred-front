/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ArchivoMovimientoClienteDto } from 'app/dto/ArchivoMovimientoClienteDto';
import { ConciliacionDto } from 'app/dto/ConciliacionDto';
import { TipoBancoDto } from 'app/dto/TipoBancoDto';
import { BancosService } from 'app/services/bancos.service';
import { ConciliacionService } from 'app/services/conciliacion.service';
import * as moment from 'moment';
import { ComprobanteClienteEditarComponent } from '../comprobantes-cliente/editar/comprobante-cliente-editar.component';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';

@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.scss'],
})
export class ConciliacionComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'identificacionCliente',
    'nombreCliente',
    'movimientoCliente',
    'movimientoBanco',
    'fechaCreacion',
    'acciones',
  ];
  dataSource = new MatTableDataSource<ConciliacionDto>([]);

  tiposEstado = [
    { id: 'NCO', descripcion: 'NO CONCILIADO' },
    { id: 'CCO', descripcion: 'CONCILIACIÓN COMPLETA' },
    { id: 'CMA', descripcion: 'CONCILIACIÓN MANUAL' },
  ];

  tipoBanco: TipoBancoDto[] = [];

  filtroComprobante = new FormControl<string>('');
  filtroNombre = new FormControl<string>('');
  filtroEstado = new FormControl<string>(this.tiposEstado[0].id);
  filtroBanco = new FormControl<number | null>(null);

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

  constructor(
    public dialog: MatDialog,
    private toast: ToastService,
    private conciliacionService: ConciliacionService,
    private bancosService: BancosService
  ) {}

  ngOnInit(): void {
    this.getAllTipoBanco();
    this.getData();
  }

  getAllTipoBanco() {
    this.bancosService.getAllTipoBanco().subscribe({
      next: tipos => {
        this.tipoBanco = tipos;
      },
      error: error => {},
    });
  }

  getData() {
    this.conciliacionService
      .getAllConciliacion(
        this.pageIndex,
        this.pageSize,
        this.filtroBanco?.value || '',
        this.filtroComprobante?.value || '',
        this.filtroNombre?.value || '',
        this.filtroEstado?.value || '',
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

    this.filtroComprobante.setValue('');
    this.filtroNombre.setValue('');
    this.filtroEstado.setValue(this.tiposEstado[0].id);
    this.filtroBanco.setValue(null);

    this.getData();
  }

  applySearchFilters() {
    const { start, end } = this.emitionRange.value;
    const auxFechaIni = start ? moment(start).subtract(5, 'hours').toISOString() : '';
    const auxFechaFin = end ? moment(end).add(18, 'hours').add(59, 'minutes').toISOString() : '';
    this.pageIndex = 0;
    this.conciliacionService
      .getAllConciliacion(
        this.pageIndex,
        this.pageSize,
        this.filtroBanco?.value || '',
        this.filtroComprobante?.value || '',
        this.filtroNombre?.value || '',
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

  conciliacionManual(item: ConciliacionDto) {
    if (
      item.archivoMovimientoCliente.estadoConciliacion !== 'NCO' &&
      item.detalleArchivoBanco.estadoConciliacion !== 'NCO'
    ) {
      return;
    }
    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto',
    });
    modalWarning.componentInstance.mensaje = '¿Está seguro de realizar la Conciliación Manual?';
    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';
    modalWarning.componentInstance.respuesta.subscribe((respuesta: boolean) => {
      if (respuesta) {
        this.conciliacionService.postConciliarManual(item.id).subscribe(() => {
          this.toast.showMessage('Conciliación Manual realizada con éxito', MessageType.SUCCESS);
          this.getData();
        });
      }
    });
  }
}
