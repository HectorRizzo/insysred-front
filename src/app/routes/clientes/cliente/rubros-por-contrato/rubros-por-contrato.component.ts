import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MessageType, ToastService } from '@core/bootstrap/toast.service';
import { ModalWarningComponent } from '@shared/components/modal-warning/modal-warning.component';
import { RubrosXContratoDto } from 'app/dto/RubrosXContratoDto';
import { RubroService } from 'app/services/rubro.service';
import { ModalAsociarRubroComponent } from './modal-asociar-rubro/modal-asociar-rubro.component';

@Component({
  selector: 'app-rubros-por-contrato',
  templateUrl: './rubros-por-contrato.component.html',
  styleUrls: ['./rubros-por-contrato.component.scss'],
})
export class RubrosPorContratoComponent implements OnInit {
  @Input() idContrato: number;

  displayedColumns: string[] = [
    'idContrato',
    'rubro',
    'cantidad',
    'valor',
    'total',
    'estado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<RubrosXContratoDto>([]);

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  constructor(
    public dialog: MatDialog,
    private toast: ToastService,
    private rubroService: RubroService
  ) {}

  getData() {
    this.rubroService.getAllRubrosXContrato(this.idContrato, 0, 50).subscribe((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.content);
      this.length = resp.totalElements;
    });
  }

  openCreateContractModal() {
    const modalEdit = this.dialog.open(ModalAsociarRubroComponent, {
      width: '60%',
      height: '90%',
      disableClose: true,
    });
    modalEdit.componentInstance.idContrato = this.idContrato;
    modalEdit.afterClosed().subscribe(() => {
      this.getData();
    });
  }

  openDeleteModal(rubroXContrato: RubrosXContratoDto) {
    if (rubroXContrato.estado !== 'PENDIENTE') return;
    const modalWarning = this.dialog.open(ModalWarningComponent, {
      width: 'auto',
    });
    modalWarning.componentInstance.mensaje =
      '¿Está seguro de anularcambiar el estado de este rubro?';
    modalWarning.componentInstance.labelButtonLeft = 'No';
    modalWarning.componentInstance.labelButtonRight = 'Si';
    modalWarning.componentInstance.respuesta.subscribe((respuesta: boolean) => {
      if (respuesta) {
        this.rubroService.deleteRubrosXContrato(rubroXContrato.id).subscribe(() => {
          this.toast.showMessage('Rubro por contrato anulado con éxito', MessageType.SUCCESS);
        });
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getData();
  }

  ngOnInit(): void {
    this.getData();
  }
}
