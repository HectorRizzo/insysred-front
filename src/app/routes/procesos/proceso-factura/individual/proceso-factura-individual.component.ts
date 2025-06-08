import { Component, Input, ViewChild } from '@angular/core';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatCheckboxDefaultOptions,
} from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ContratoDto } from 'app/dto/ContratoDto';
import { PeriodoDto } from 'app/dto/PeriodoDto';
import { ProcesarPeriodoResultadoDto } from 'app/dto/ProcesarPeriodoResultadoDto';
import { ClientsService } from 'app/services/clients.service';
import { PeriodoService } from 'app/services/periodo.service';
import { ProcesoFacturaResumenComponent } from '../resumen/proceso-factura-resumen.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-proceso-factura-individual',
  templateUrl: './proceso-factura-individual.component.html',
  styleUrls: ['./proceso-factura-individual.component.scss'],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'check' } as MatCheckboxDefaultOptions,
    },
  ],
})
export class ProcesoFacturaIndividualComponent {
  @ViewChild('tablaSeleccionados') tablaSeleccionados: MatTable<any>;
  @Input() periodos: PeriodoDto[];

  valorFiltroCliente: string;

  periodoSeleccionado: PeriodoDto;
  contratosSeleccionados: ContratoDto[] = [];
  idContratosSeleccionados: number[] = [];

  displayedColumns: string[] = ['id', 'identificacion', 'cliente', 'fechaContrato', 'ubicacion', 'estado'];
  dataSource = new MatTableDataSource<ContratoDto>([]);

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  indeterminate = false;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private clientsService: ClientsService,
    private periodoService: PeriodoService
  ) {}

  clear() {
    this.pageSize = 5;
    this.pageIndex = 0;
    this.valorFiltroCliente = '';
    this.getData();
  }

  getData() {
    this.clientsService
      .getContractosCliente(this.pageIndex, this.pageSize, this.valorFiltroCliente || '')
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

  indeterminateChange(event: boolean, contrato: ContratoDto) {
    const index = this.idContratosSeleccionados.findIndex(obj => obj === contrato.numContrato);
    if (event && index == -1) {
      this.idContratosSeleccionados.push(contrato.numContrato);
      this.contratosSeleccionados.push(contrato);
      this.tablaSeleccionados.renderRows();
    } else if (!event && index > -1) {
      this.idContratosSeleccionados.splice(index, 1);
      this.contratosSeleccionados.splice(index, 1);
      this.tablaSeleccionados.renderRows();
    }
  }

  change(event: any, contrato: ContratoDto) {
    const index = this.idContratosSeleccionados.findIndex(obj => obj === contrato.numContrato);
    if (event?.checked && index == -1) {
      this.idContratosSeleccionados.push(contrato.numContrato);
      this.contratosSeleccionados.push(contrato);
      this.tablaSeleccionados.renderRows();
    } else if (!event?.checked && index > -1) {
      this.idContratosSeleccionados.splice(index, 1);
      this.contratosSeleccionados.splice(index, 1);
      this.tablaSeleccionados.renderRows();
    }
  }

  procesar() {
    if (!this.periodoSeleccionado) {
      this.openSnackBar('Debe seleccionar un periodo.');
      return;
    }
    if (this.idContratosSeleccionados?.length == 0) {
      this.openSnackBar('Debe seleccionar al menos un contrato.');
      return;
    }
    this.periodoService
      .getProcesar(this.periodoSeleccionado.id, this.idContratosSeleccionados)
      .subscribe({
        next: resumen => {
          this.openSnackBar('Éxito en el proceso individual.');
          this.verResumen(this.periodoSeleccionado, resumen);
          this.idContratosSeleccionados = [];
          this.contratosSeleccionados = [];
          this.tablaSeleccionados.renderRows();
        },
        error: error => {
          console.log('Error:', error);
        },
      });
  }

  verResumen(periodo: PeriodoDto, resumen: ProcesarPeriodoResultadoDto) {
    const modalAnular = this.dialog.open(ProcesoFacturaResumenComponent, {
      width: '50%',
      disableClose: true,
    });
    modalAnular.componentInstance.resumen = resumen;
    modalAnular.componentInstance.periodo = periodo;
  }

  openSnackBar(message: string, actions: string | undefined = undefined) {
    this.snackBar.open(message, actions, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
